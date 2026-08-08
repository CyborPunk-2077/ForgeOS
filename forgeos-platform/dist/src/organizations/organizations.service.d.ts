import { PrismaService } from '../database/prisma.service';
export declare class OrganizationsService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<({
        members: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            organizationId: number | null;
            roleId: number | null;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    findOne(id: number): Promise<{
        members: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            userId: number;
            organizationId: number | null;
            roleId: number | null;
        }[];
    } & {
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(organizationData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, organizationData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: number): Promise<void>;
    findByName(name: string): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
    addMember(organizationId: number, userId: number, role: number): Promise<{
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            email: string;
        };
        organization: {
            id: number;
            name: string;
            description: string | null;
            createdAt: Date;
            updatedAt: Date;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        organizationId: number | null;
        roleId: number | null;
    }>;
    removeMember(organizationId: number, userId: number): Promise<void>;
    getMembers(organizationId: number): Promise<({
        user: {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            username: string;
            email: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        userId: number;
        organizationId: number | null;
        roleId: number | null;
    })[]>;
}
