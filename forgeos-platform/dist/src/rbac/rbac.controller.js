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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RbacController = void 0;
const common_1 = require("@nestjs/common");
const rbac_service_1 = require("./rbac.service");
const rbac_guard_1 = require("./rbac.guard");
const rbac_decorators_1 = require("./rbac.decorators");
const auth_guard_1 = require("../auth/auth.guard");
let RbacController = class RbacController {
    rbacService;
    constructor(rbacService) {
        this.rbacService = rbacService;
    }
    async createRole(roleData) {
        return this.rbacService.createRole(roleData);
    }
    async getAllRoles() {
        return this.rbacService.getAllRoles();
    }
    async getRoleById(id) {
        try {
            return this.rbacService.findRoleById(parseInt(id));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Role not found');
        }
    }
    async getRoleByName(name) {
        try {
            return this.rbacService.findRoleByName(name);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Role not found');
        }
    }
    async updateRole(id, roleData) {
        try {
            return this.rbacService.updateRole(parseInt(id), roleData);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Role not found');
        }
    }
    async deleteRole(id) {
        try {
            return this.rbacService.deleteRole(parseInt(id));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Role not found');
        }
    }
    async createPermission(permissionData) {
        return this.rbacService.createPermission(permissionData);
    }
    async getAllPermissions() {
        return this.rbacService.getAllPermissions();
    }
    async getPermissionById(id) {
        try {
            return this.rbacService.findPermissionById(parseInt(id));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Permission not found');
        }
    }
    async getPermissionByName(name) {
        try {
            return this.rbacService.findPermissionByName(name);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Permission not found');
        }
    }
    async updatePermission(id, permissionData) {
        try {
            return this.rbacService.updatePermission(parseInt(id), permissionData);
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Permission not found');
        }
    }
    async deletePermission(id) {
        try {
            return this.rbacService.deletePermission(parseInt(id));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Permission not found');
        }
    }
    async assignRoleToUser(assignmentData) {
        return this.rbacService.assignRoleToUser(assignmentData.userId, assignmentData.roleId);
    }
    async removeRoleFromUser(userId) {
        try {
            return this.rbacService.removeRoleFromUser(parseInt(userId));
        }
        catch (error) {
            if (error instanceof common_1.NotFoundException) {
                throw error;
            }
            throw new common_1.NotFoundException('Membership not found');
        }
    }
    async checkPermission(userId, permissionName) {
        const hasPermission = await this.rbacService.hasPermission(parseInt(userId), permissionName);
        return { hasPermission };
    }
    async checkRole(userId, roleName) {
        const hasRole = await this.rbacService.hasRole(parseInt(userId), roleName);
        return { hasRole };
    }
};
exports.RbacController = RbacController;
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, rbac_decorators_1.RequirePermissions)('rbac:manage'),
    (0, common_1.Post)('roles'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "createRole", null);
__decorate([
    (0, common_1.Get)('roles'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getAllRoles", null);
__decorate([
    (0, common_1.Get)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getRoleById", null);
__decorate([
    (0, common_1.Get)('roles/name/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getRoleByName", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, rbac_decorators_1.RequirePermissions)('rbac:manage'),
    (0, common_1.Patch)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "updateRole", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, rbac_decorators_1.RequirePermissions)('rbac:manage'),
    (0, common_1.Delete)('roles/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "deleteRole", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, rbac_decorators_1.RequirePermissions)('rbac:manage'),
    (0, common_1.Post)('permissions'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "createPermission", null);
__decorate([
    (0, common_1.Get)('permissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getAllPermissions", null);
__decorate([
    (0, common_1.Get)('permissions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getPermissionById", null);
__decorate([
    (0, common_1.Get)('permissions/name/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "getPermissionByName", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, rbac_decorators_1.RequirePermissions)('rbac:manage'),
    (0, common_1.Patch)('permissions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "updatePermission", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, rbac_decorators_1.RequirePermissions)('rbac:manage'),
    (0, common_1.Delete)('permissions/:id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "deletePermission", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, rbac_decorators_1.RequirePermissions)('rbac:manage'),
    (0, common_1.Post)('assign-role'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "assignRoleToUser", null);
__decorate([
    (0, common_1.UseGuards)(auth_guard_1.JwtAuthGuard, rbac_guard_1.RbacGuard),
    (0, rbac_decorators_1.RequirePermissions)('rbac:manage'),
    (0, common_1.Delete)('remove-role/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "removeRoleFromUser", null);
__decorate([
    (0, common_1.Get)('has-permission/:userId/:permissionName'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('permissionName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "checkPermission", null);
__decorate([
    (0, common_1.Get)('has-role/:userId/:roleName'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Param)('roleName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RbacController.prototype, "checkRole", null);
exports.RbacController = RbacController = __decorate([
    (0, common_1.Controller)('rbac'),
    __metadata("design:paramtypes", [rbac_service_1.RbacService])
], RbacController);
//# sourceMappingURL=rbac.controller.js.map