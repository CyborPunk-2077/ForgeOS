"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const config_service_1 = require("../config/config.service");
const users_service_1 = require("../users/users.service");
const prisma_service_1 = require("../database/prisma.service");
const bcryptjs_1 = require("bcryptjs");
const crypto_1 = require("crypto");
const duration_util_1 = require("../common/duration.util");
let AuthService = class AuthService {
    usersService;
    jwtService;
    configService;
    prisma;
    constructor(usersService, jwtService, configService, prisma) {
        this.usersService = usersService;
        this.jwtService = jwtService;
        this.configService = configService;
        this.prisma = prisma;
    }
    async validateUser(username, password) {
        const user = await this.usersService.findOneByUsername(username);
        if (user && await (0, bcryptjs_1.compare)(password, user.password)) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        const payload = { username: user.username, sub: user.id };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = await this.issueRefreshToken(user.id);
        return { access_token, refresh_token };
    }
    async refreshTokens(rawRefreshToken) {
        const tokenHash = this.hashToken(rawRefreshToken);
        const stored = await this.prisma.refreshToken.findUnique({
            where: { tokenHash },
            include: { user: true },
        });
        if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
        await this.prisma.refreshToken.update({
            where: { id: stored.id },
            data: { revokedAt: new Date() },
        });
        const payload = { username: stored.user.username, sub: stored.user.id };
        const access_token = this.jwtService.sign(payload);
        const refresh_token = await this.issueRefreshToken(stored.user.id);
        return { access_token, refresh_token };
    }
    async logout(rawRefreshToken) {
        const tokenHash = this.hashToken(rawRefreshToken);
        await this.prisma.refreshToken.updateMany({
            where: { tokenHash, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    async issueRefreshToken(userId) {
        const rawToken = (0, crypto_1.randomBytes)(48).toString('hex');
        const tokenHash = this.hashToken(rawToken);
        const expiresAt = new Date(Date.now() + (0, duration_util_1.parseDurationToMs)(this.configService.getRefreshTokenExpiresIn()));
        await this.prisma.refreshToken.create({
            data: { tokenHash, userId, expiresAt },
        });
        return rawToken;
    }
    hashToken(rawToken) {
        return (0, crypto_1.createHash)('sha256').update(rawToken).digest('hex');
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        jwt_1.JwtService,
        config_service_1.ConfigService,
        prisma_service_1.PrismaService])
], AuthService);
//# sourceMappingURL=auth.service.js.map