import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Bootstraps the baseline RBAC roles. Idempotent — safe to run repeatedly.
 * Endpoints that mutate roles/permissions/API keys require 'rbac:manage',
 * so at least one of these roles must exist (and be assigned to a user via
 * a direct DB write, since assigning roles is itself gated) before the
 * RBAC API can be used to manage itself.
 */
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
