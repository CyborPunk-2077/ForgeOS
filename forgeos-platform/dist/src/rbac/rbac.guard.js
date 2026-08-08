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
exports.RbacGuard = void 0;
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const rbac_service_1 = require("./rbac.service");
const rbac_decorators_1 = require("./rbac.decorators");
let RbacGuard = class RbacGuard {
    reflector;
    rbacService;
    constructor(reflector, rbacService) {
        this.reflector = reflector;
        this.rbacService = rbacService;
    }
    async canActivate(context) {
        const requiredPermissions = this.reflector.getAllAndOverride(rbac_decorators_1.PERMISSIONS_KEY, [context.getHandler(), context.getClass()]);
        const requiredRoles = this.reflector.getAllAndOverride(rbac_decorators_1.ROLES_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if ((!requiredPermissions || requiredPermissions.length === 0) &&
            (!requiredRoles || requiredRoles.length === 0)) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userId = request.user?.userId;
        if (!userId) {
            throw new common_1.UnauthorizedException('Authentication required');
        }
        if (requiredPermissions && requiredPermissions.length > 0) {
            const checks = await Promise.all(requiredPermissions.map((permission) => this.rbacService.hasPermission(userId, permission)));
            if (!checks.every(Boolean)) {
                throw new common_1.ForbiddenException('Insufficient permissions');
            }
        }
        if (requiredRoles && requiredRoles.length > 0) {
            const checks = await Promise.all(requiredRoles.map((role) => this.rbacService.hasRole(userId, role)));
            if (!checks.some(Boolean)) {
                throw new common_1.ForbiddenException('Insufficient role');
            }
        }
        return true;
    }
};
exports.RbacGuard = RbacGuard;
exports.RbacGuard = RbacGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [core_1.Reflector,
        rbac_service_1.RbacService])
], RbacGuard);
//# sourceMappingURL=rbac.guard.js.map