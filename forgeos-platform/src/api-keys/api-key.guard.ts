import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';

/**
 * Authenticates a request via the 'X-API-Key' header, for
 * machine-to-machine access as an alternative to JWT bearer auth.
 * Populates req.user with the same shape as JwtStrategy ({ userId, username })
 * so downstream guards (e.g. RbacGuard) work identically either way.
 */
@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const rawKey = request.headers['x-api-key'];

    if (!rawKey || typeof rawKey !== 'string') {
      throw new UnauthorizedException('Missing API key');
    }

    const identity = await this.apiKeysService.validateKey(rawKey);
    if (!identity) {
      throw new UnauthorizedException('Invalid or expired API key');
    }

    request.user = identity;
    return true;
  }
}
