import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';

@Injectable()
export class RbacService {
  constructor(private prisma: PrismaService) {}

  // Role methods
  async createRole(roleData: any) {
    const role = await this.prisma.role.create({
      data: {
        name: roleData.name,
        description: roleData.description,
        permissions: roleData.permissions || [],
      },
    });
    
    return role;
  }

  async findRoleById(id: number) {
    const role = await this.prisma.role.findUnique({
      where: { id },
    });
    
    if (!role) {
      throw new NotFoundException('Role not found');
    }
    
    return role;
  }

  async findRoleByName(name: string) {
    return this.prisma.role.findUnique({
      where: { name },
    });
  }

  async updateRole(id: number, roleData: any) {
    try {
      const role = await this.prisma.role.update({
        where: { id },
        data: {
          name: roleData.name,
          description: roleData.description,
          permissions: roleData.permissions || [],
        },
      });
      
      return role;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Role not found');
      }
      throw error;
    }
  }

  async deleteRole(id: number) {
    try {
      await this.prisma.role.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Role not found');
      }
      throw error;
    }
  }

  async getAllRoles() {
    return this.prisma.role.findMany();
  }

  // Permission methods
  async createPermission(permissionData: any) {
    const permission = await this.prisma.permission.create({
      data: {
        name: permissionData.name,
        description: permissionData.description,
      },
    });
    
    return permission;
  }

  async findPermissionById(id: number) {
    const permission = await this.prisma.permission.findUnique({
      where: { id },
    });
    
    if (!permission) {
      throw new NotFoundException('Permission not found');
    }
    
    return permission;
  }

  async findPermissionByName(name: string) {
    return this.prisma.permission.findUnique({
      where: { name },
    });
  }

  async updatePermission(id: number, permissionData: any) {
    try {
      const permission = await this.prisma.permission.update({
        where: { id },
        data: {
          name: permissionData.name,
          description: permissionData.description,
        },
      });
      
      return permission;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Permission not found');
      }
      throw error;
    }
  }

  async deletePermission(id: number) {
    try {
      await this.prisma.permission.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Permission not found');
      }
      throw error;
    }
  }

  async getAllPermissions() {
    return this.prisma.permission.findMany();
  }

  // Role assignment methods
  async assignRoleToUser(userId: number, roleId: number) {
    // First check if the role exists
    await this.findRoleById(roleId);

    // Prisma doesn't allow null in a compound unique lookup, so find the
    // global-scope membership (no organization) first, then update by id.
    const existingMembership = await this.prisma.membership.findFirst({
      where: { userId, organizationId: null },
    });

    if (!existingMembership) {
      throw new NotFoundException('Membership not found');
    }

    const membership = await this.prisma.membership.update({
      where: { id: existingMembership.id },
      data: {
        roleId,
      },
    });

    return membership;
  }

  async removeRoleFromUser(userId: number) {
    try {
      const existingMembership = await this.prisma.membership.findFirst({
        where: { userId, organizationId: null },
      });

      if (!existingMembership) {
        throw new NotFoundException('Membership not found');
      }

      const membership = await this.prisma.membership.update({
        where: { id: existingMembership.id },
        data: {
          roleId: null,
        },
      });

      return membership;
    } catch (error: any) {
      if (error.code === 'P2025') {
        throw new NotFoundException('Membership not found');
      }
      throw error;
    }
  }

  // Check if user has a specific permission, across any of their memberships
  async hasPermission(userId: number, permissionName: string): Promise<boolean> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: { role: true },
    });

    return memberships.some((membership) =>
      membership.role?.permissions.includes(permissionName),
    );
  }

  // Check if user has a specific role, across any of their memberships
  async hasRole(userId: number, roleName: string): Promise<boolean> {
    const memberships = await this.prisma.membership.findMany({
      where: { userId },
      include: { role: true },
    });

    return memberships.some((membership) => membership.role?.name === roleName);
  }
}
