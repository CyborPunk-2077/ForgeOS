"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let RbacService = class RbacService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createRole(roleData) {
        const role = await this.prisma.role.create({
            data: {
                name: roleData.name,
                description: roleData.description,
                permissions: roleData.permissions || [],
            },
        });
        return role;
    }
    async findRoleById(id) {
        const role = await this.prisma.role.findUnique({
            where: { id },
        });
        if (!role) {
            throw new common_1.NotFoundException('Role not found');
        }
        return role;
    }
    async findRoleByName(name) {
        return this.prisma.role.findUnique({
            where: { name },
        });
    }
    async updateRole(id, roleData) {
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
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Role not found');
            }
            throw error;
        }
    }
    async deleteRole(id) {
        try {
            await this.prisma.role.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Role not found');
            }
            throw error;
        }
    }
    async getAllRoles() {
        return this.prisma.role.findMany();
    }
    async createPermission(permissionData) {
        const permission = await this.prisma.permission.create({
            data: {
                name: permissionData.name,
                description: permissionData.description,
            },
        });
        return permission;
    }
    async findPermissionById(id) {
        const permission = await this.prisma.permission.findUnique({
            where: { id },
        });
        if (!permission) {
            throw new common_1.NotFoundException('Permission not found');
        }
        return permission;
    }
    async findPermissionByName(name) {
        return this.prisma.permission.findUnique({
            where: { name },
        });
    }
    async updatePermission(id, permissionData) {
        try {
            const permission = await this.prisma.permission.update({
                where: { id },
                data: {
                    name: permissionData.name,
                    description: permissionData.description,
                },
            });
            return permission;
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Permission not found');
            }
            throw error;
        }
    }
    async deletePermission(id) {
        try {
            await this.prisma.permission.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Permission not found');
            }
            throw error;
        }
    }
    async getAllPermissions() {
        return this.prisma.permission.findMany();
    }
    async assignRoleToUser(userId, roleId) {
        await this.findRoleById(roleId);
        const existingMembership = await this.prisma.membership.findFirst({
            where: { userId, organizationId: null },
        });
        if (!existingMembership) {
            throw new common_1.NotFoundException('Membership not found');
        }
        const membership = await this.prisma.membership.update({
            where: { id: existingMembership.id },
            data: {
                roleId,
            },
        });
        return membership;
    }
    async removeRoleFromUser(userId) {
        try {
            const existingMembership = await this.prisma.membership.findFirst({
                where: { userId, organizationId: null },
            });
            if (!existingMembership) {
                throw new common_1.NotFoundException('Membership not found');
            }
            const membership = await this.prisma.membership.update({
                where: { id: existingMembership.id },
                data: {
                    roleId: null,
                },
            });
            return membership;
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Membership not found');
            }
            throw error;
        }
    }
    async hasPermission(userId, permissionName) {
        const memberships = await this.prisma.membership.findMany({
            where: { userId },
            include: { role: true },
        });
        return memberships.some((membership) => membership.role?.permissions.includes(permissionName));
    }
    async hasRole(userId, roleName) {
        const memberships = await this.prisma.membership.findMany({
            where: { userId },
            include: { role: true },
        });
        return memberships.some((membership) => membership.role?.name === roleName);
    }
};
exports.RbacService = RbacService;
exports.RbacService = RbacService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], RbacService);
//# sourceMappingURL=rbac.service.js.map