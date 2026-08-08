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
exports.OrganizationsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../database/prisma.service");
let OrganizationsService = class OrganizationsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.organization.findMany({
            include: {
                members: true,
            },
        });
    }
    async findOne(id) {
        const organization = await this.prisma.organization.findUnique({
            where: { id },
            include: {
                members: true,
            },
        });
        if (!organization) {
            throw new common_1.NotFoundException('Organization not found');
        }
        return organization;
    }
    async create(organizationData) {
        const organization = await this.prisma.organization.create({
            data: {
                name: organizationData.name,
                description: organizationData.description,
            },
        });
        return organization;
    }
    async update(id, organizationData) {
        try {
            const organization = await this.prisma.organization.update({
                where: { id },
                data: {
                    name: organizationData.name,
                    description: organizationData.description,
                },
            });
            return organization;
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Organization not found');
            }
            throw error;
        }
    }
    async delete(id) {
        try {
            await this.prisma.organization.delete({
                where: { id },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Organization not found');
            }
            throw error;
        }
    }
    async findByName(name) {
        return this.prisma.organization.findUnique({
            where: { name },
        });
    }
    async addMember(organizationId, userId, role) {
        const membership = await this.prisma.membership.create({
            data: {
                userId,
                organizationId,
                roleId: role,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                organization: true,
            },
        });
        return membership;
    }
    async removeMember(organizationId, userId) {
        try {
            await this.prisma.membership.delete({
                where: {
                    userId_organizationId: {
                        userId,
                        organizationId,
                    },
                },
            });
        }
        catch (error) {
            if (error.code === 'P2025') {
                throw new common_1.NotFoundException('Membership not found');
            }
            throw error;
        }
    }
    async getMembers(organizationId) {
        return this.prisma.membership.findMany({
            where: { organizationId },
            include: {
                user: {
                    select: {
                        id: true,
                        username: true,
                        email: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
            },
        });
    }
};
exports.OrganizationsService = OrganizationsService;
exports.OrganizationsService = OrganizationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OrganizationsService);
//# sourceMappingURL=organizations.service.js.map