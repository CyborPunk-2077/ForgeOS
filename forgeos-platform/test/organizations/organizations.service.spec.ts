import { Test, TestingModule } from '@nestjs/testing';
import { OrganizationsService } from '../../src/organizations/organizations.service';
import { PrismaService } from '../../src/database/prisma.service';

describe('OrganizationsService', () => {
  let service: OrganizationsService;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrganizationsService,
        {
          provide: PrismaService,
          useValue: {
            organization: {
              findMany: jest.fn(),
              findUnique: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<OrganizationsService>(OrganizationsService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return all organizations', async () => {
      const result = [{ id: 1, name: 'Test Org', description: 'Test Description' }];
      jest.spyOn(prismaService.organization, 'findMany').mockResolvedValue(result);

      expect(await service.findAll()).toBe(result);
    });
  });

  describe('findOne', () => {
    it('should return an organization by id', async () => {
      const result = { id: 1, name: 'Test Org', description: 'Test Description' };
      jest.spyOn(prismaService.organization, 'findUnique').mockResolvedValue(result);

      expect(await service.findOne(1)).toBe(result);
    });

    it('should throw NotFoundException when organization not found', async () => {
      jest.spyOn(prismaService.organization, 'findUnique').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow('Organization not found');
    });
  });

  describe('create', () => {
    it('should create a new organization', async () => {
      const orgData = {
        name: 'New Org',
        description: 'New Description',
      };
      
      const result = { 
        id: 1, 
        ...orgData
      };
      
      jest.spyOn(prismaService.organization, 'create').mockResolvedValue({
        id: 1,
        ...orgData
      });

      expect(await service.create(orgData)).toEqual(result);
    });
  });

  describe('update', () => {
    it('should update an organization', async () => {
      const orgData = {
        name: 'Updated Org',
        description: 'Updated Description',
      };
      
      const result = { 
        id: 1, 
        ...orgData
      };
      
      jest.spyOn(prismaService.organization, 'update').mockResolvedValue({
        id: 1,
        ...orgData
      });

      expect(await service.update(1, orgData)).toEqual(result);
    });

    it('should throw NotFoundException when updating non-existent organization', async () => {
      const orgData = {
        name: 'Updated Org',
        description: 'Updated Description',
      };
      
      jest.spyOn(prismaService.organization, 'update').mockRejectedValue({
        code: 'P2025'
      });

      await expect(service.update(999, orgData)).rejects.toThrow('Organization not found');
    });
  });

  describe('delete', () => {
    it('should delete an organization', async () => {
      jest.spyOn(prismaService.organization, 'delete').mockResolvedValue(undefined);

      await expect(service.delete(1)).resolves.toBeUndefined();
    });

    it('should throw NotFoundException when deleting non-existent organization', async () => {
      jest.spyOn(prismaService.organization, 'delete').mockRejectedValue({
        code: 'P2025'
      });

      await expect(service.delete(999)).rejects.toThrow('Organization not found');
    });
  });
});