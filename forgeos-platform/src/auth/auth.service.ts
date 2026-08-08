import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '../config/config.service';
import { UsersService } from '../users/users.service';
import { PrismaService } from '../database/prisma.service';
import { compare } from 'bcryptjs';
import { randomBytes, createHash } from 'crypto';
import { parseDurationToMs } from '../common/duration.util';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);
    if (user && await compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const access_token = this.jwtService.sign(payload);
    const refresh_token = await this.issueRefreshToken(user.id);

    return { access_token, refresh_token };
  }

  /**
   * Exchanges a valid, unexpired, unrevoked refresh token for a new
   * access/refresh token pair, revoking the presented token in the same
   * operation (rotation) so it cannot be replayed.
   */
  async refreshTokens(rawRefreshToken: string) {
    const tokenHash = this.hashToken(rawRefreshToken);

    const stored = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date()) {
      throw new UnauthorizedException('Invalid refresh token');
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

  /**
   * Revokes a refresh token (logout). Silently no-ops if it doesn't exist
   * or is already revoked, so this endpoint never leaks token validity.
   */
  async logout(rawRefreshToken: string): Promise<void> {
    const tokenHash = this.hashToken(rawRefreshToken);
    await this.prisma.refreshToken.updateMany({
      where: { tokenHash, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }

  private async issueRefreshToken(userId: number): Promise<string> {
    const rawToken = randomBytes(48).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(
      Date.now() + parseDurationToMs(this.configService.getRefreshTokenExpiresIn()),
    );

    await this.prisma.refreshToken.create({
      data: { tokenHash, userId, expiresAt },
    });

    return rawToken;
  }

  private hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }
}
