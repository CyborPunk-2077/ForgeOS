import { RbacService } from './rbac.service';
export declare class RbacController {
    private readonly rbacService;
    constructor(rbacService: RbacService);
    createRole(roleData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllRoles(): Promise<{
        id: number;
        name: string;
        description: string | null;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getRoleById(id: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    getRoleByName(name: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateRole(id: string, roleData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteRole(id: string): Promise<void>;
    createPermission(permissionData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getAllPermissions(): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getPermissionById(id: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getPermissionByName(name: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updatePermission(id: string, permissionData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePermission(id: string): Promise<void>;
    assignRoleToUser(assignmentData: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        organizationId: number | null;
        roleId: number | null;
    }>;
    removeRoleFromUser(userId: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        organizationId: number | null;
        roleId: number | null;
    }>;
    checkPermission(userId: string, permissionName: string): Promise<{
        hasPermission: boolean;
    }>;
    checkRole(userId: string, roleName: string): Promise<{
        hasRole: boolean;
    }>;
}
