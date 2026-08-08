export declare const PERMISSIONS_KEY = "requiredPermissions";
export declare const ROLES_KEY = "requiredRoles";
export declare const RequirePermissions: (...permissions: string[]) => import("@nestjs/common").CustomDecorator<string>;
export declare const RequireRoles: (...roles: string[]) => import("@nestjs/common").CustomDecorator<string>;
