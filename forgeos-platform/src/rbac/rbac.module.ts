import { Module } from '@nestjs/common';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { RbacGuard } from './rbac.guard';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  providers: [RbacService, RbacGuard],
  controllers: [RbacController],
  exports: [RbacService, RbacGuard],
})
export class RbacModule {}
