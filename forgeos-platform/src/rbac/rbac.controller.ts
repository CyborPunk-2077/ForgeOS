import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacGuard } from './rbac.guard';
import { RequirePermissions } from './rbac.decorators';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('rbac')
export class RbacController {
  constructor(private readonly rbacService: RbacService) {}

  // Role endpoints
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions('rbac:manage')
  @Post('roles')
  async createRole(@Body() roleData: any) {
    return this.rbacService.createRole(roleData);
  }

  @Get('roles')
  async getAllRoles() {
    return this.rbacService.getAllRoles();
  }

  @Get('roles/:id')
  async getRoleById(@Param('id') id: string) {
    try {
      return this.rbacService.findRoleById(parseInt(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Role not found');
    }
  }

  @Get('roles/name/:name')
  async getRoleByName(@Param('name') name: string) {
    try {
      return this.rbacService.findRoleByName(name);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Role not found');
    }
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions('rbac:manage')
  @Patch('roles/:id')
  async updateRole(@Param('id') id: string, @Body() roleData: any) {
    try {
      return this.rbacService.updateRole(parseInt(id), roleData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Role not found');
    }
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions('rbac:manage')
  @Delete('roles/:id')
  async deleteRole(@Param('id') id: string) {
    try {
      return this.rbacService.deleteRole(parseInt(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Role not found');
    }
  }

  // Permission endpoints
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions('rbac:manage')
  @Post('permissions')
  async createPermission(@Body() permissionData: any) {
    return this.rbacService.createPermission(permissionData);
  }

  @Get('permissions')
  async getAllPermissions() {
    return this.rbacService.getAllPermissions();
  }

  @Get('permissions/:id')
  async getPermissionById(@Param('id') id: string) {
    try {
      return this.rbacService.findPermissionById(parseInt(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Permission not found');
    }
  }

  @Get('permissions/name/:name')
  async getPermissionByName(@Param('name') name: string) {
    try {
      return this.rbacService.findPermissionByName(name);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Permission not found');
    }
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions('rbac:manage')
  @Patch('permissions/:id')
  async updatePermission(@Param('id') id: string, @Body() permissionData: any) {
    try {
      return this.rbacService.updatePermission(parseInt(id), permissionData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Permission not found');
    }
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions('rbac:manage')
  @Delete('permissions/:id')
  async deletePermission(@Param('id') id: string) {
    try {
      return this.rbacService.deletePermission(parseInt(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Permission not found');
    }
  }

  // Role assignment endpoints
  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions('rbac:manage')
  @Post('assign-role')
  async assignRoleToUser(@Body() assignmentData: any) {
    return this.rbacService.assignRoleToUser(
      assignmentData.userId,
      assignmentData.roleId,
    );
  }

  @UseGuards(JwtAuthGuard, RbacGuard)
  @RequirePermissions('rbac:manage')
  @Delete('remove-role/:userId')
  async removeRoleFromUser(@Param('userId') userId: string) {
    try {
      return this.rbacService.removeRoleFromUser(parseInt(userId));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Membership not found');
    }
  }

  // Check permissions
  @Get('has-permission/:userId/:permissionName')
  async checkPermission(
    @Param('userId') userId: string,
    @Param('permissionName') permissionName: string,
  ) {
    const hasPermission = await this.rbacService.hasPermission(
      parseInt(userId),
      permissionName,
    );
    return { hasPermission };
  }

  @Get('has-role/:userId/:roleName')
  async checkRole(
    @Param('userId') userId: string,
    @Param('roleName') roleName: string,
  ) {
    const hasRole = await this.rbacService.hasRole(parseInt(userId), roleName);
    return { hasRole };
  }
}