import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from '../../src/users/users.service';
import { PrismaService } from '../../src/database/prisma.service';
import { ConfigService } from '../../src/config/config.service';

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
        {
          provide: ConfigService,
          useValue: {
            getPasswordHashRounds: jest.fn().mockReturnValue(10),
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const result = [{ id: 1, username: 'testuser', email: 'test@example.com' }];
      jest.spyOn(prismaService.user, 'findMany').mockResolvedValue(result);

      expect(await service.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const result = { id: 1, username: 'testuser', email: 'test@example.com' };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(result);

      expect(await service.findOne(1)).toEqual(result);
    });

    it('should throw NotFoundException when user not found', async () => {
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('User not found');
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const userData = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };
      
      const result = { 
        id: 1, 
        ...userData,
        password: undefined // password should be removed from response
      };
      
      jest.spyOn(prismaService.user, 'create').mockResolvedValue({
        id: 1,
        ...userData,
        password: 'hashed_password'
      });

      expect(await service.create(userData)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userData = {
        username: 'updateduser',
        email: 'updated@example.com',
        password: 'newpassword123',
      };
      
      const result = { 
        id: 1, 
        ...userData,
        password: undefined // password should be removed from response
      };
      
      jest.spyOn(prismaService.user, 'update').mockResolvedValue({
        id: 1,
        ...userData,
        password: 'hashed_password'
      });

      expect(await service.update(1, userData)).toEqual(result);
    });

    it('should throw NotFoundException when updating non-existent user', async () => {
      const userData = {
        username: 'updateduser',
        email: 'updated@example.com',
        password: 'newpassword123',
      };
      
      jest.spyOn(prismaService.user, 'update').mockRejectedValue({
        code: 'P2025'
      });

      await expect(service.update(999, userData)).rejects.toThrow('User not found');
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      jest.spyOn(prismaService.user, 'delete').mockResolvedValue(undefined);

      await expect(service.remove(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when removing non-existent user', async () => {
      jest.spyOn(prismaService.user, 'delete').mockRejectedValue({
        code: 'P2025'
      });

      await expect(service.remove(999)).rejects.toThrow('User not found');
    });
  });

  describe('findOneByUsername', () => {
    it('should return a user by username', async () => {
      const result = { id: 1, username: 'testuser', email: 'test@example.com' };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(result);

      expect(await service.findOneByUsername('testuser')).toBe(result);
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      const result = { id: 1, username: 'testuser', email: 'test@example.com' };
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(result);

      expect(await service.findByUsername('testuser')).toBe(result);
    });
  });
});