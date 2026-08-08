import { ConfigService } from '@nestjs/config';
export declare class ForgeConfigService {
    private configService;
    constructor(configService: ConfigService);
    getDatabaseUrl(): string;
    getJwtSecret(): string;
    getJwtExpiresIn(): string;
    getRefreshTokenExpiresIn(): string;
    getPasswordHashRounds(): number;
    getNodeEnv(): string;
    getPort(): number;
}
export { ForgeConfigService as ConfigService };
