import { SetMetadata } from '@nestjs/common';

export const PERMISSIONS_KEY = 'requiredPermissions';
export const ROLES_KEY = 'requiredRoles';

/**
 * Requires the authenticated user to hold ALL of the listed permissions
 * (via any of their role memberships) to access the route.
 */
export const RequirePermissions = (...permissions: string[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);

/**
 * Requires the authenticated user to hold AT LEAST ONE of the listed roles
 * (via any of their memberships) to access the route.
 */
export const RequireRoles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
