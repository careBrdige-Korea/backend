import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHospitalDto, UpdateHospitalDto, HospitalQueryDto } from './dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class HospitalsService {
  constructor(private prisma: PrismaService) {}

  async create(createDto: CreateHospitalDto) {
    return this.prisma.hospital.create({
      data: createDto,
    });
  }

  async findAll(queryDto: HospitalQueryDto) {
    const { page = 1, limit = 10, region, department } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.HospitalWhereInput = {};
    if (region) where.region = region;
    if (department) where.department = department;

    const [items, totalItems] = await Promise.all([
      this.prisma.hospital.findMany({
        where,
        select: {
          id: true,
          name: true,
          region: true,
          department: true,
          isForeignFriendly: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.hospital.count({ where }),
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
    const hospital = await this.prisma.hospital.findUnique({ where: { id } });

    if (!hospital) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: '병원을 찾을 수 없습니다.',
      });
    }

    return hospital;
  }

  async update(id: number, updateDto: UpdateHospitalDto) {
    await this.findOne(id);
    return this.prisma.hospital.update({
      where: { id },
      data: updateDto,
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    await this.prisma.hospital.delete({ where: { id } });
    return { message: '병원이 삭제되었습니다.' };
  }

  async findByIds(ids: number[]) {
    return this.prisma.hospital.findMany({
      where: { id: { in: ids } },
    });
  }
}
