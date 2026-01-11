import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateConsultationDto,
  UpdateConsultationDto,
  ConsultationQueryDto,
} from './dto';
import { Prisma, Consultation } from '@prisma/client';

@Injectable()
export class ConsultationsService {
  constructor(private prisma: PrismaService) {}

  async create(
    createDto: CreateConsultationDto,
    userId?: number,
  ): Promise<Consultation> {
    return this.prisma.consultation.create({
      data: {
        userNickname: createDto.userNickname,
        contactType: createDto.contactType,
        contactInfo: createDto.contactInfo,
        nationality: createDto.nationality,
        language: createDto.language,
        location: createDto.location,
        symptoms: createDto.symptoms,
        userId,
        preferredAt: createDto.preferredAt
          ? new Date(createDto.preferredAt)
          : null,
      },
    });
  }

  async findAll(queryDto: ConsultationQueryDto) {
    const { page = 1, limit = 10, status } = queryDto;
    const skip = (page - 1) * limit;

    const where: Prisma.ConsultationWhereInput = {};
    if (status) where.status = status;

    const [items, totalItems] = await Promise.all([
      this.prisma.consultation.findMany({
        where,
        select: {
          id: true,
          userNickname: true,
          contactType: true,
          status: true,
          createdAt: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.consultation.count({ where }),
    ]);

    return {
      items: items.map((item) => ({
        ...item,
        id: Number(item.id),
      })),
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
    const consultation = await this.prisma.consultation.findUnique({
      where: { id: BigInt(id) },
      include: {
        recommendations: {
          include: {
            hospital: true,
          },
        },
      },
    });

    if (!consultation) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: '상담을 찾을 수 없습니다.',
      });
    }

    return {
      ...consultation,
      id: Number(consultation.id),
      recommendations: consultation.recommendations.map((rec) => ({
        ...rec,
        id: Number(rec.id),
        consultationId: Number(rec.consultationId),
      })),
    };
  }

  async update(id: number, updateDto: UpdateConsultationDto) {
    await this.findOne(id);
    const updated = await this.prisma.consultation.update({
      where: { id: BigInt(id) },
      data: updateDto,
    });
    return {
      ...updated,
      id: Number(updated.id),
    };
  }
}
