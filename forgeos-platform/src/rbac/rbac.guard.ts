import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RbacService } from './rbac.service';
import { PERMISSIONS_KEY, ROLES_KEY } from './rbac.decorators';

/**
 * Enforces @RequirePermissions/@RequireRoles metadata against the
 * authenticated user (req.user.userId, populated by JwtAuthGuard).
 * Must be applied after JwtAuthGuard in the guard chain.
 */
@Injectable()
export class RbacGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private rbacService: RbacService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (
      (!requiredPermissions || requiredPermissions.length === 0) &&
      (!requiredRoles || requiredRoles.length === 0)
    ) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user?.userId;

    if (!userId) {
      throw new UnauthorizedException('Authentication required');
    }

    if (requiredPermissions && requiredPermissions.length > 0) {
      const checks = await Promise.all(
        requiredPermissions.map((permission) =>
          this.rbacService.hasPermission(userId, permission),
        ),
      );
      if (!checks.every(Boolean)) {
        throw new ForbiddenException('Insufficient permissions');
      }
    }

    if (requiredRoles && requiredRoles.length > 0) {
      const checks = await Promise.all(
        requiredRoles.map((role) => this.rbacService.hasRole(userId, role)),
      );
      if (!checks.some(Boolean)) {
        throw new ForbiddenException('Insufficient role');
      }
    }

    return true;
  }
}
