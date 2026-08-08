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
exports.ApiKeysService = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const prisma_service_1 = require("../database/prisma.service");
const KEY_PREFIX_BYTES = 6;
const KEY_SECRET_BYTES = 32;
let ApiKeysService = class ApiKeysService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async generate(userId, name, expiresInDays) {
        const prefix = (0, crypto_1.randomBytes)(KEY_PREFIX_BYTES).toString('hex');
        const secret = (0, crypto_1.randomBytes)(KEY_SECRET_BYTES).toString('hex');
        const keyHash = this.hashSecret(secret);
        const expiresAt = expiresInDays
            ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
            : null;
        const apiKey = await this.prisma.apiKey.create({
            data: {
                name,
                userId,
                keyPrefix: prefix,
                keyHash,
                expiresAt,
            },
        });
        return {
            id: apiKey.id,
            name: apiKey.name,
            key: `fgos_${prefix}.${secret}`,
            keyPrefix: prefix,
            expiresAt: apiKey.expiresAt,
            createdAt: apiKey.createdAt,
        };
    }
    async findAllForUser(userId) {
        const keys = await this.prisma.apiKey.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return keys.map(({ keyHash, ...metadata }) => metadata);
    }
    async revoke(userId, id) {
        const apiKey = await this.prisma.apiKey.findUnique({ where: { id } });
        if (!apiKey || apiKey.userId !== userId) {
            throw new common_1.NotFoundException('API key not found');
        }
        await this.prisma.apiKey.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
    }
    async validateKey(rawKey) {
        const secret = rawKey.includes('.') ? rawKey.split('.').slice(1).join('.') : rawKey;
        if (!secret) {
            return null;
        }
        const keyHash = this.hashSecret(secret);
        const apiKey = await this.prisma.apiKey.findUnique({
            where: { keyHash },
            include: { user: true },
        });
        if (!apiKey || apiKey.revokedAt || (apiKey.expiresAt && apiKey.expiresAt < new Date())) {
            return null;
        }
        await this.prisma.apiKey.update({
            where: { id: apiKey.id },
            data: { lastUsedAt: new Date() },
        });
        return { userId: apiKey.user.id, username: apiKey.user.username };
    }
    hashSecret(secret) {
        return (0, crypto_1.createHash)('sha256').update(secret).digest('hex');
    }
};
exports.ApiKeysService = ApiKeysService;
exports.ApiKeysService = ApiKeysService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ApiKeysService);
//# sourceMappingURL=api-keys.service.js.map