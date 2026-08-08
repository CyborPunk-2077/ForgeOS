import { Injectable, NotFoundException } from '@nestjs/common';
import { randomBytes, createHash } from 'crypto';
import { PrismaService } from '../database/prisma.service';

const KEY_PREFIX_BYTES = 6;
const KEY_SECRET_BYTES = 32;

@Injectable()
export class ApiKeysService {
  constructor(private prisma: PrismaService) {}

  /**
   * Generates a new API key for the given user. The raw key is returned
   * ONLY here, at creation time — only its hash is ever persisted, so it
   * cannot be recovered later.
   */
  async generate(userId: number, name: string, expiresInDays?: number) {
    const prefix = randomBytes(KEY_PREFIX_BYTES).toString('hex');
    const secret = randomBytes(KEY_SECRET_BYTES).toString('hex');
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

  async findAllForUser(userId: number) {
    const keys = await this.prisma.apiKey.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    return keys.map(({ keyHash, ...metadata }) => metadata);
  }

  async revoke(userId: number, id: number) {
    const apiKey = await this.prisma.apiKey.findUnique({ where: { id } });

    if (!apiKey || apiKey.userId !== userId) {
      throw new NotFoundException('API key not found');
    }

    await this.prisma.apiKey.update({
      where: { id },
      data: { revokedAt: new Date() },
    });
  }

  /**
   * Validates a raw presented key (format: "fgos_<prefix>.<secret>") and
   * returns the owning user's id/username if it's valid, unrevoked, and
   * unexpired — or null otherwise. Updates lastUsedAt as a side effect.
   */
  async validateKey(rawKey: string): Promise<{ userId: number; username: string } | null> {
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

  private hashSecret(secret: string): string {
    return createHash('sha256').update(secret).digest('hex');
  }
}
