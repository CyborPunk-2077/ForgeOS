import { OrganizationsService } from './organizations.service';
export declare class OrganizationsController {
    private readonly organizationsService;
    constructor(organizationsService: OrganizationsService);
    create(organizationData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
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
    findOne(id: string): Promise<{
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
    update(id: string, organizationData: any): Promise<{
        id: number;
        name: string;
        description: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(id: string): Promise<void>;
    addMember(organizationId: string, membershipData: any): Promise<{
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
    removeMember(organizationId: string, userId: string): Promise<void>;
    getMembers(organizationId: string): Promise<({
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
