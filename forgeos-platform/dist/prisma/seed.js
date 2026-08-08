"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function main() {
    await prisma.role.upsert({
        where: { name: 'admin' },
        update: {
            permissions: [
                'rbac:manage',
                'users:manage',
                'organizations:manage',
                'api-keys:manage',
            ],
        },
        create: {
            name: 'admin',
            description: 'Full platform administrator',
            permissions: [
                'rbac:manage',
                'users:manage',
                'organizations:manage',
                'api-keys:manage',
            ],
        },
    });
    await prisma.role.upsert({
        where: { name: 'member' },
        update: {
            permissions: ['users:read', 'organizations:read'],
        },
        create: {
            name: 'member',
            description: 'Standard organization member',
            permissions: ['users:read', 'organizations:read'],
        },
    });
    console.log('Seeded baseline roles: admin, member');
}
main()
    .catch((error) => {
    console.error(error);
    process.exitCode = 1;
})
    .finally(async () => {
    await prisma.$disconnect();
});
//# sourceMappingURL=seed.js.map