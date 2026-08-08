import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ApiKeysService } from '../../src/api-keys/api-keys.service';
import { PrismaService } from '../../src/database/prisma.service';

describe('ApiKeysService', () => {
  let service: ApiKeysService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeysService,
        {
          provide: PrismaService,
          useValue: {
            apiKey: {
              create: jest.fn(),
              findMany: jest.fn(),
              findUnique: jest.fn(),
              update: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ApiKeysService>(ApiKeysService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generate', () => {
    it('should create a key and return the raw key exactly once', async () => {
      jest.spyOn(prisma.apiKey, 'create').mockResolvedValue({
        id: 1,
        name: 'CI key',
        keyPrefix: 'abc123',
        expiresAt: null,
        createdAt: new Date(),
      } as any);

      const result = await service.generate(1, 'CI key');

      expect(result.name).toBe('CI key');
      expect(result.key).toMatch(/^fgos_[0-9a-f]+\.[0-9a-f]+$/);
      expect((result as any).keyHash).toBeUndefined();

      const persisted = (prisma.apiKey.create as jest.Mock).mock.calls[0][0].data;
      expect(persisted.userId).toBe(1);
      expect(persisted.keyHash).not.toBe(result.key);
    });
  });

  describe('findAllForUser', () => {
    it('should return key metadata without the hash', async () => {
      jest.spyOn(prisma.apiKey, 'findMany').mockResolvedValue([
        { id: 1, name: 'CI key', keyPrefix: 'abc123', keyHash: 'secret-hash', userId: 1 } as any,
      ]);

      const result = await service.findAllForUser(1);

      expect(result).toEqual([{ id: 1, name: 'CI key', keyPrefix: 'abc123', userId: 1 }]);
    });
  });

  describe('revoke', () => {
    it('should revoke a key owned by the user', async () => {
      jest.spyOn(prisma.apiKey, 'findUnique').mockResolvedValue({ id: 1, userId: 1 } as any);
      jest.spyOn(prisma.apiKey, 'update').mockResolvedValue({} as any);

      await service.revoke(1, 1);

      expect(prisma.apiKey.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { revokedAt: expect.any(Date) },
      });
    });

    it('should throw NotFoundException for a key owned by another user', async () => {
      jest.spyOn(prisma.apiKey, 'findUnique').mockResolvedValue({ id: 1, userId: 2 } as any);

      await expect(service.revoke(1, 1)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException when the key does not exist', async () => {
      jest.spyOn(prisma.apiKey, 'findUnique').mockResolvedValue(null);

      await expect(service.revoke(1, 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('validateKey', () => {
    it('should return the owning user for a valid key', async () => {
      jest.spyOn(prisma.apiKey, 'findUnique').mockResolvedValue({
        id: 1,
        revokedAt: null,
        expiresAt: null,
        user: { id: 1, username: 'bob' },
      } as any);
      jest.spyOn(prisma.apiKey, 'update').mockResolvedValue({} as any);

      const result = await service.validateKey('fgos_abc123.deadbeef');

      expect(result).toEqual({ userId: 1, username: 'bob' });
    });

    it('should return null for an unknown key', async () => {
      jest.spyOn(prisma.apiKey, 'findUnique').mockResolvedValue(null);

      const result = await service.validateKey('fgos_abc123.deadbeef');
      expect(result).toBeNull();
    });

    it('should return null for a revoked key', async () => {
      jest.spyOn(prisma.apiKey, 'findUnique').mockResolvedValue({
        id: 1,
        revokedAt: new Date(),
        expiresAt: null,
        user: { id: 1, username: 'bob' },
      } as any);

      const result = await service.validateKey('fgos_abc123.deadbeef');
      expect(result).toBeNull();
    });

    it('should return null for an expired key', async () => {
      jest.spyOn(prisma.apiKey, 'findUnique').mockResolvedValue({
        id: 1,
        revokedAt: null,
        expiresAt: new Date(Date.now() - 1000),
        user: { id: 1, username: 'bob' },
      } as any);

      const result = await service.validateKey('fgos_abc123.deadbeef');
      expect(result).toBeNull();
    });
  });
});
