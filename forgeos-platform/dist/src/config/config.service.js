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
exports.ConfigService = exports.ForgeConfigService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
let ForgeConfigService = class ForgeConfigService {
    configService;
    constructor(configService) {
        this.configService = configService;
    }
    getDatabaseUrl() {
        return this.configService.get('DATABASE_URL') || '';
    }
    getJwtSecret() {
        return this.configService.get('JWT_SECRET') || '';
    }
    getJwtExpiresIn() {
        return this.configService.get('JWT_EXPIRES_IN') || '1h';
    }
    getRefreshTokenExpiresIn() {
        return this.configService.get('REFRESH_TOKEN_EXPIRES_IN') || '7d';
    }
    getPasswordHashRounds() {
        const value = this.configService.get('PASSWORD_HASH_ROUNDS');
        return value ? parseInt(value, 10) : 10;
    }
    getNodeEnv() {
        return this.configService.get('NODE_ENV') || 'development';
    }
    getPort() {
        const value = this.configService.get('PORT');
        return value ? parseInt(value, 10) : 3000;
    }
};
exports.ForgeConfigService = ForgeConfigService;
exports.ConfigService = ForgeConfigService;
exports.ConfigService = exports.ForgeConfigService = ForgeConfigService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], ForgeConfigService);
//# sourceMappingURL=config.service.js.map