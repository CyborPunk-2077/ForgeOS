import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '../config/config.service';
export declare class UsersService {
    private prisma;
    private configService;
    constructor(prisma: PrismaService, configService: ConfigService);
    findAll(): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string;
    }[]>;
    findOne(id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string;
    }>;
    create(userData: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string;
    }>;
    update(id: number, userData: any): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string;
    }>;
    remove(id: number): Promise<void>;
    findOneByUsername(username: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string;
        password: string;
    } | null>;
    findByUsername(username: string): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        username: string;
        email: string;
        password: string;
    } | null>;
}
