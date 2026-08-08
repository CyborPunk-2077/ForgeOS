import { PrismaService } from '../database/prisma.service';
export declare class ApiKeysService {
    private prisma;
    constructor(prisma: PrismaService);
    generate(userId: number, name: string, expiresInDays?: number): Promise<{
        id: number;
        name: string;
        key: string;
        keyPrefix: string;
        expiresAt: Date | null;
        createdAt: Date;
    }>;
    findAllForUser(userId: number): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        userId: number;
        expiresAt: Date | null;
        revokedAt: Date | null;
        keyPrefix: string;
        lastUsedAt: Date | null;
    }[]>;
    revoke(userId: number, id: number): Promise<void>;
    validateKey(rawKey: string): Promise<{
        userId: number;
        username: string;
    } | null>;
    private hashSecret;
}
