import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
export declare class ApiKeysController {
    private readonly apiKeysService;
    constructor(apiKeysService: ApiKeysService);
    create(req: any, dto: CreateApiKeyDto): Promise<{
        id: number;
        name: string;
        key: string;
        keyPrefix: string;
        expiresAt: Date | null;
        createdAt: Date;
    }>;
    findAll(req: any): Promise<{
        id: number;
        name: string;
        createdAt: Date;
        userId: number;
        expiresAt: Date | null;
        revokedAt: Date | null;
        keyPrefix: string;
        lastUsedAt: Date | null;
    }[]>;
    revoke(req: any, id: string): Promise<{
        message: string;
    }>;
}
