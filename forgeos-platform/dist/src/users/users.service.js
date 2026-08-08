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
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
const config_service_1 = require("../config/config.service");
const bcryptjs_1 = require("bcryptjs");
let UsersService = class UsersService {
    prisma;
    configService;
    constructor(prisma, configService) {
        this.prisma = prisma;
        this.configService = configService;
    }
    async findAll() {
        const users = await this.prisma.user.findMany();
        return users.map(({ password, ...result }) => result);
    }
    async findOne(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const { password, ...result } = user;
        return result;
    }
    async create(userData) {
        const hashedPassword = await (0, bcryptjs_1.hash)(userData.password, this.configService.getPasswordHashRounds());
        const user = await this.prisma.user.create({
            data: {
                username: userData.username,
                email: userData.email,
                password: hashedPassword,
            },
        });
        const { password, ...result } = user;
        return result;
    }
    async update(id, userData) {
        try {
            const hashedPassword = userData.password
                ? await (0, bcryptjs_1.hash)(userData.password, this.configService.getPasswordHashRounds())
                : undefined;
            const user = await this.prisma.user.update({
                where: { id },
                data: {
                    username: userData.username,
                    email: userData.email,
                    password: hashedPassword,
                },
            });
            const { password, ...result } = user;
            return result;
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('User not found');
            }
            throw error;
        }
    }
    async remove(id) {
        try {
            await this.prisma.user.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('User not found');
            }
            throw error;
        }
    }
    async findOneByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }
    async findByUsername(username) {
        return this.prisma.user.findUnique({
            where: { username },
        });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        config_service_1.ConfigService])
], UsersService);
//# sourceMappingURL=users.service.js.map