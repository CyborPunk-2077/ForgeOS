import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { OrganizationsService } from './organizations.service';

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly organizationsService: OrganizationsService) {}

  @Post()
  async create(@Body() organizationData: any) {
    return this.organizationsService.create(organizationData);
  }

  @Get()
  async findAll() {
    return this.organizationsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    try {
      return this.organizationsService.findOne(parseInt(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Organization not found');
    }
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() organizationData: any) {
    try {
      return this.organizationsService.update(parseInt(id), organizationData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Organization not found');
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    try {
      return this.organizationsService.delete(parseInt(id));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new NotFoundException('Organization not found');
    }
  }

  // Membership endpoints
  @Post(':id/members')
  async addMember(
    @Param('id') organizationId: string,
    @Body() membershipData: any,
  ) {
    return this.organizationsService.addMember(
      parseInt(organizationId),
      membershipData.userId,
      membershipData.role,
    );
  }

  @Delete(':id/members/:userId')
  async removeMember(
    @Param('id') organizationId: string,
    @Param('userId') userId: string,
  ) {
    return this.organizationsService.removeMember(
      parseInt(organizationId),
      parseInt(userId),
    );
  }

  @Get(':id/members')
  async getMembers(@Param('id') organizationId: string) {
    return this.organizationsService.getMembers(parseInt(organizationId));
  }
}