import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/dto/pagination.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: { email: string; password: string; role?: Role }) {
    return this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        role: data.role || Role.USER,
      },
    });
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  async findAll(paginationDto: PaginationDto) {
    const { page = 1, limit = 10 } = paginationDto;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await Promise.all([
      this.prisma.user.findMany({
        select: { id: true, email: true, role: true, createdAt: true },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return {
      items,
      meta: {
        totalItems,
        itemCount: items.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: '사용자를 찾을 수 없습니다.',
      });
    }

    return user;
  }

  async updateRefreshToken(id: number, refreshToken: string) {
    await this.prisma.user.update({
      where: { id },
      data: { refreshToken },
    });
  }

  async updatePassword(id: number, password: string) {
    await this.prisma.user.update({
      where: { id },
      data: { password },
    });
  }
}
