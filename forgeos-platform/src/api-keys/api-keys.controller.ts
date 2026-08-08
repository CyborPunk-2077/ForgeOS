import { Controller, Get, Post, Body, Delete, Param, UseGuards, Request } from '@nestjs/common';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { JwtAuthGuard } from '../auth/auth.guard';

@Controller('api-keys')
@UseGuards(JwtAuthGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  async create(@Request() req: any, @Body() dto: CreateApiKeyDto) {
    return this.apiKeysService.generate(req.user.userId, dto.name, dto.expiresInDays);
  }

  @Get()
  async findAll(@Request() req: any) {
    return this.apiKeysService.findAllForUser(req.user.userId);
  }

  @Delete(':id')
  async revoke(@Request() req: any, @Param('id') id: string) {
    await this.apiKeysService.revoke(req.user.userId, parseInt(id, 10));
    return { message: 'API key revoked' };
  }
}
