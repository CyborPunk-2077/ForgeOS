import { Injectable } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Injectable()
export class ForgeConfigService {
  constructor(private configService: ConfigService) {}

  getDatabaseUrl(): string {
    return this.configService.get<string>('DATABASE_URL') || '';
  }

  getJwtSecret(): string {
    return this.configService.get<string>('JWT_SECRET') || '';
  }

  getJwtExpiresIn(): string {
    return this.configService.get<string>('JWT_EXPIRES_IN') || '1h';
  }

  getRefreshTokenExpiresIn(): string {
    return this.configService.get<string>('REFRESH_TOKEN_EXPIRES_IN') || '7d';
  }

  getPasswordHashRounds(): number {
    return this.configService.get<number>('PASSWORD_HASH_ROUNDS') || 10;
  }

  getNodeEnv(): string {
    return this.configService.get<string>('NODE_ENV') || 'development';
  }

  getPort(): number {
    return this.configService.get<number>('PORT') || 3000;
  }
}
