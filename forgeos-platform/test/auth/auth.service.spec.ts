import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { UsersService } from '../../src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../../src/config/config.service';
import { PrismaService } from '../../src/database/prisma.service';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;
  let configService: ConfigService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findOneByUsername: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getRefreshTokenExpiresIn: jest.fn(),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            refreshToken: {
              create: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
              updateMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user when credentials are valid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: '$2b$10$hashedpassword' // Mock hashed password
      };
      
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(mockUser);
      // Mock bcrypt compare to return true for valid password
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password123');
      
      expect(result).toEqual({ id: 1, username: 'testuser' });
    });

    it('should return null when user not found', async () => {
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');
      
      expect(result).toBeNull();
    });

    it('should return null when password is invalid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: '$2b$10$hashedpassword'
      };
      
      jest.spyOn(usersService, 'findOneByUsername').mockResolvedValue(mockUser);
      // Mock bcrypt compare to return false for invalid password
      jest.spyOn(require('bcryptjs'), 'compare').mockResolvedValue(false);

      const result = await service.validateUser('testuser', 'wrongpassword');
      
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return an access_token and a stored, hashed refresh_token', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser'
      };

      jest.spyOn(jwtService, 'sign').mockReturnValue('access_token');
      jest.spyOn(configService, 'getRefreshTokenExpiresIn').mockReturnValue('7d');
      jest.spyOn(prismaService.refreshToken, 'create').mockResolvedValue({} as any);

      const result = await service.login(mockUser);

      expect(result.access_token).toBe('access_token');
      expect(typeof result.refresh_token).toBe('string');
      expect(result.refresh_token.length).toBeGreaterThan(0);
      expect(prismaService.refreshToken.create).toHaveBeenCalledWith({
        data: expect.objectContaining({ userId: 1 }),
      });
      // The raw token returned to the client must never be what's persisted.
      const persistedData = (prismaService.refreshToken.create as jest.Mock).mock
        .calls[0][0].data;
      expect(persistedData.tokenHash).not.toBe(result.refresh_token);
    });
  });

  describe('refreshTokens', () => {
    it('should rotate a valid refresh token for a new pair', async () => {
      const stored = {
        id: 1,
        tokenHash: 'hash',
        userId: 1,
        expiresAt: new Date(Date.now() + 1000 * 60),
        revokedAt: null,
        user: { id: 1, username: 'testuser' },
      };

      jest.spyOn(prismaService.refreshToken, 'findUnique').mockResolvedValue(stored as any);
      jest.spyOn(prismaService.refreshToken, 'update').mockResolvedValue({} as any);
      jest.spyOn(prismaService.refreshToken, 'create').mockResolvedValue({} as any);
      jest.spyOn(jwtService, 'sign').mockReturnValue('new_access_token');
      jest.spyOn(configService, 'getRefreshTokenExpiresIn').mockReturnValue('7d');

      const result = await service.refreshTokens('some-raw-token');

      expect(result.access_token).toBe('new_access_token');
      expect(prismaService.refreshToken.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: expect.objectContaining({ revokedAt: expect.any(Date) }),
      });
    });

    it('should reject an unknown refresh token', async () => {
      jest.spyOn(prismaService.refreshToken, 'findUnique').mockResolvedValue(null);

      await expect(service.refreshTokens('bogus')).rejects.toThrow('Invalid refresh token');
    });

    it('should reject an expired refresh token', async () => {
      jest.spyOn(prismaService.refreshToken, 'findUnique').mockResolvedValue({
        id: 1,
        tokenHash: 'hash',
        userId: 1,
        expiresAt: new Date(Date.now() - 1000),
        revokedAt: null,
        user: { id: 1, username: 'testuser' },
      } as any);

      await expect(service.refreshTokens('expired')).rejects.toThrow('Invalid refresh token');
    });

    it('should reject an already-revoked refresh token', async () => {
      jest.spyOn(prismaService.refreshToken, 'findUnique').mockResolvedValue({
        id: 1,
        tokenHash: 'hash',
        userId: 1,
        expiresAt: new Date(Date.now() + 1000 * 60),
        revokedAt: new Date(),
        user: { id: 1, username: 'testuser' },
      } as any);

      await expect(service.refreshTokens('revoked')).rejects.toThrow('Invalid refresh token');
    });
  });

  describe('logout', () => {
    it('should revoke the presented refresh token', async () => {
      jest.spyOn(prismaService.refreshToken, 'updateMany').mockResolvedValue({ count: 1 } as any);

      await service.logout('some-raw-token');

      expect(prismaService.refreshToken.updateMany).toHaveBeenCalledWith({
        where: expect.objectContaining({ revokedAt: null }),
        data: expect.objectContaining({ revokedAt: expect.any(Date) }),
      });
    });
  });
});