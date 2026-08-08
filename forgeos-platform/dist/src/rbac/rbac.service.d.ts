import { PrismaService } from '../database/prisma.service';
export declare class RbacService {
    private prisma;
    constructor(prisma: PrismaService);
    createRole(roleData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    findRoleById(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    findRoleByName(name: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updateRole(id: number, roleData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteRole(id: number): Promise<void>;
    getAllRoles(): Promise<{
        id: number;
        name: string;
        description: string | null;
        permissions: string[];
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createPermission(permissionData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findPermissionById(id: number): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findPermissionByName(name: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    updatePermission(id: number, permissionData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deletePermission(id: number): Promise<void>;
    getAllPermissions(): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    assignRoleToUser(userId: number, roleId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        organizationId: number | null;
        roleId: number | null;
    }>;
    removeRoleFromUser(userId: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        organizationId: number | null;
        roleId: number | null;
    }>;
    hasPermission(userId: number, permissionName: string): Promise<boolean>;
    hasRole(userId: number, roleName: string): Promise<boolean>;
}
