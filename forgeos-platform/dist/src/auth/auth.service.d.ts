import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../database/prisma.service';
export declare class AuthService {
    private usersService;
    private jwtService;
    private configService;
    private prisma;
    constructor(usersService: UsersService, jwtService: JwtService, configService: ConfigService, prisma: PrismaService);
    validateUser(username: string, password: string): Promise<any>;
    login(user: any): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    refreshTokens(rawRefreshToken: string): Promise<{
        access_token: string;
        refresh_token: string;
    }>;
    logout(rawRefreshToken: string): Promise<void>;
    private issueRefreshToken;
    private hashToken;
}
