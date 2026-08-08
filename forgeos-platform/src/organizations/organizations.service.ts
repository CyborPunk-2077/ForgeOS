import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class OrganizationsService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.organization.findMany({
      include: {
        members: true,
      },
    });
  }

  async findOne(id: number) {
    const organization = await this.prisma.organization.findUnique({
      where: { id },
      include: {
        members: true,
      },
    });
    
    if (!organization) {
      throw new NotFoundException('Organization not found');
    }
    
    return organization;
  }

  async create(organizationData: any) {
    const organization = await this.prisma.organization.create({
      data: {
        name: organizationData.name,
        description: organizationData.description,
      },
    });
    
    return organization;
  }

  async update(id: number, organizationData: any) {
    try {
      const organization = await this.prisma.organization.update({
        where: { id },
        data: {
          name: organizationData.name,
          description: organizationData.description,
        },
      });
      
      return organization;
    } catch (error: any) {
      if (error.code === 'P2025') { // Prisma error for record not found
        throw new NotFoundException('Organization not found');
      }
      throw error;
    }
  }

  async delete(id: number) {
    try {
      await this.prisma.organization.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') { // Prisma error for record not found
        throw new NotFoundException('Organization not found');
      }
      throw error;
    }
  }

  async findByName(name: string) {
    return this.prisma.organization.findUnique({
      where: { name },
    });
  }

  // Membership methods
  async addMember(organizationId: number, userId: number, role: number) {
    const membership = await this.prisma.membership.create({
      data: {
        userId,
        organizationId,
        roleId: role,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
        organization: true,
      },
    });

    return membership;
  }

  async removeMember(organizationId: number, userId: number) {
    try {
      await this.prisma.membership.delete({
        where: {
          userId_organizationId: {
            userId,
            organizationId,
          },
        },
      });
    } catch (error: any) {
      if (error.code === 'P2025') { // Prisma error for record not found
        throw new NotFoundException('Membership not found');
      }
      throw error;
    }
  }

  async getMembers(organizationId: number) {
    return this.prisma.membership.findMany({
      where: { organizationId },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });
  }
}