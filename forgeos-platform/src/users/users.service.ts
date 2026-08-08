import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { ConfigService } from '../config/config.service';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map(({ password, ...result }) => result);
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { password, ...result } = user;
    return result;
  }

  async create(userData: any) {
    const hashedPassword = await hash(
      userData.password,
      this.configService.getPasswordHashRounds(),
    );

    // Remove password hash from the response
    const user = await this.prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
      },
    });

    // Return user without password hash
    const { password, ...result } = user;
    return result;
  }

  async update(id: number, userData: any) {
    try {
      const hashedPassword = userData.password
        ? await hash(userData.password, this.configService.getPasswordHashRounds())
        : undefined;

      const user = await this.prisma.user.update({
        where: { id },
        data: {
          username: userData.username,
          email: userData.email,
          password: hashedPassword,
        },
      });

      // Return user without password hash
      const { password, ...result } = user;
      return result;
    } catch (error: any) {
      if (error.code === 'P2025') { // Prisma error for record not found
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async remove(id: number) {
    try {
      await this.prisma.user.delete({
        where: { id },
      });
    } catch (error: any) {
      if (error.code === 'P2025') { // Prisma error for record not found
        throw new NotFoundException('User not found');
      }
      throw error;
    }
  }

  async findOneByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }

  async findByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: { username },
    });
  }
}
