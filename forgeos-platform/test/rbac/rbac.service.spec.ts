import { Test, TestingModule } from '@nestjs/testing';
import { RbacService } from '../../src/rbac/rbac.service';
import { PrismaService } from '../../src/database/prisma.service';

describe('RbacService', () => {
  let service: RbacService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RbacService,
        {
          provide: PrismaService,
          useValue: {
            role: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            permission: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
            membership: {
              update: jest.fn(),
              findFirst: jest.fn(),
              findMany: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<RbacService>(RbacService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createRole', () => {
    it('should create a role', async () => {
      const roleData = {
        name: 'test-role',
        description: 'Test role description',
        permissions: ['read', 'write'],
      };
      
      const mockRole = {
        id: 1,
        ...roleData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      jest.spyOn(prisma.role, 'create').mockResolvedValue(mockRole);
      
      const result = await service.createRole(roleData);
      
      expect(result).toEqual(mockRole);
      expect(prisma.role.create).toHaveBeenCalledWith({
        data: roleData,
      });
    });
  });

  describe('findRoleById', () => {
    it('should find a role by ID', async () => {
      const mockRole = {
        id: 1,
        name: 'test-role',
        description: 'Test role description',
        permissions: ['read', 'write'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(mockRole);
      
      const result = await service.findRoleById(1);
      
      expect(result).toEqual(mockRole);
      expect(prisma.role.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException when role not found', async () => {
      jest.spyOn(prisma.role, 'findUnique').mockResolvedValue(null);
      
      await expect(service.findRoleById(999)).rejects.toThrow();
    });
  });

  describe('createPermission', () => {
    it('should create a permission', async () => {
      const permissionData = {
        name: 'test-permission',
        description: 'Test permission description',
      };
      
      const mockPermission = {
        id: 1,
        ...permissionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      jest.spyOn(prisma.permission, 'create').mockResolvedValue(mockPermission);
      
      const result = await service.createPermission(permissionData);
      
      expect(result).toEqual(mockPermission);
      expect(prisma.permission.create).toHaveBeenCalledWith({
        data: permissionData,
      });
    });
  });

  describe('assignRoleToUser', () => {
    it('should assign a role to user', async () => {
      const mockMembership = {
        id: 1,
        userId: 1,
        organizationId: null,
        roleId: 1,
        role: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      // Mock the findRoleById to resolve successfully
      jest.spyOn(service, 'findRoleById').mockResolvedValue({
        id: 1,
        name: 'test-role',
        description: 'Test role',
        permissions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      
      // Mock finding the existing global-scope membership, then the update
      jest.spyOn(prisma.membership, 'findFirst').mockResolvedValue(mockMembership);
      jest.spyOn(prisma.membership, 'update').mockResolvedValue(mockMembership);
      
      const result = await service.assignRoleToUser(1, 1);
      
      expect(result).toEqual(mockMembership);
      expect(prisma.membership.update).toHaveBeenCalled();
    });
  });

  describe('hasPermission', () => {
    it('should return true when one of the user memberships has the permission', async () => {
      jest.spyOn(prisma.membership, 'findMany').mockResolvedValue([
        {
          id: 1,
          userId: 1,
          organizationId: 1,
          roleId: 1,
          role: { id: 1, name: 'admin', permissions: ['users:read', 'users:write'] },
        } as any,
      ]);

      const result = await service.hasPermission(1, 'users:write');
      expect(result).toBe(true);
    });

    it('should return false when no membership role has the permission', async () => {
      jest.spyOn(prisma.membership, 'findMany').mockResolvedValue([
        {
          id: 1,
          userId: 1,
          organizationId: 1,
          roleId: 1,
          role: { id: 1, name: 'viewer', permissions: ['users:read'] },
        } as any,
      ]);

      const result = await service.hasPermission(1, 'users:write');
      expect(result).toBe(false);
    });
  });

  describe('hasRole', () => {
    it('should return true when one of the user memberships has the role', async () => {
      jest.spyOn(prisma.membership, 'findMany').mockResolvedValue([
        { id: 1, userId: 1, organizationId: 1, roleId: 1, role: { id: 1, name: 'admin', permissions: [] } } as any,
      ]);

      const result = await service.hasRole(1, 'admin');
      expect(result).toBe(true);
    });

    it('should return false when no membership has the role', async () => {
      jest.spyOn(prisma.membership, 'findMany').mockResolvedValue([
        { id: 1, userId: 1, organizationId: 1, roleId: 1, role: { id: 1, name: 'viewer', permissions: [] } } as any,
      ]);

      const result = await service.hasRole(1, 'admin');
      expect(result).toBe(false);
    });
  });
});