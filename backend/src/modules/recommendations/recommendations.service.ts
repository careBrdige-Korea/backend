import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRecommendationDto, UpdateBookingStatusDto } from './dto';
import { ConsultationsService } from '../consultations/consultations.service';
import { HospitalsService } from '../hospitals/hospitals.service';

@Injectable()
export class RecommendationsService {
  constructor(
    private prisma: PrismaService,
    private consultationsService: ConsultationsService,
    private hospitalsService: HospitalsService,
  ) {}

  async create(createDto: CreateRecommendationDto) {
    // 상담 존재 확인
    await this.consultationsService.findOne(createDto.consultationId);

    // 병원들 존재 확인
    const hospitals = await this.hospitalsService.findByIds(
      createDto.hospitalIds,
    );
    if (hospitals.length !== createDto.hospitalIds.length) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '존재하지 않는 병원이 포함되어 있습니다.',
      });
    }

    // 중복 추천 확인
    const existingRecommendations = await this.prisma.recommendation.findMany({
      where: {
        consultationId: BigInt(createDto.consultationId),
        hospitalId: { in: createDto.hospitalIds },
      },
    });

    if (existingRecommendations.length > 0) {
      const duplicateIds = existingRecommendations.map((r) => r.hospitalId);
      throw new ConflictException({
        code: 'DUPLICATE_ENTRY',
        message: `이미 추천된 병원이 있습니다: ${duplicateIds.join(', ')}`,
      });
    }

    // 추천 생성
    const savedRecommendations = await Promise.all(
      createDto.hospitalIds.map((hospitalId) =>
        this.prisma.recommendation.create({
          data: {
            consultationId: BigInt(createDto.consultationId),
            hospitalId,
          },
        }),
      ),
    );

    return {
      ids: savedRecommendations.map((r) => Number(r.id)),
      count: savedRecommendations.length,
    };
  }

  async findOne(id: number) {
    const recommendation = await this.prisma.recommendation.findUnique({
      where: { id: BigInt(id) },
      include: {
        hospital: true,
        consultation: true,
      },
    });

    if (!recommendation) {
      throw new NotFoundException({
        code: 'NOT_FOUND',
        message: '추천을 찾을 수 없습니다.',
      });
    }

    return {
      ...recommendation,
      id: Number(recommendation.id),
      consultationId: Number(recommendation.consultationId),
      consultation: {
        ...recommendation.consultation,
        id: Number(recommendation.consultation.id),
      },
    };
  }

  async select(id: number) {
    const recommendation = await this.findOne(id);

    if (recommendation.isSelected) {
      throw new BadRequestException({
        code: 'VALIDATION_ERROR',
        message: '이미 선택된 추천입니다.',
      });
    }

    const updated = await this.prisma.recommendation.update({
      where: { id: BigInt(id) },
      data: {
        isSelected: true,
        selectedAt: new Date(),
      },
    });

    return {
      ...updated,
      id: Number(updated.id),
      consultationId: Number(updated.consultationId),
    };
  }

  async updateBookingStatus(id: number, updateDto: UpdateBookingStatusDto) {
    await this.findOne(id);
    const updated = await this.prisma.recommendation.update({
      where: { id: BigInt(id) },
      data: { bookingStatus: updateDto.bookingStatus },
    });

    return {
      ...updated,
      id: Number(updated.id),
      consultationId: Number(updated.consultationId),
    };
  }

  async findByConsultationId(consultationId: number) {
    const recommendations = await this.prisma.recommendation.findMany({
      where: { consultationId: BigInt(consultationId) },
      include: { hospital: true },
    });

    return recommendations.map((rec) => ({
      ...rec,
      id: Number(rec.id),
      consultationId: Number(rec.consultationId),
    }));
  }
}
