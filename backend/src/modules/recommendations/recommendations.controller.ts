import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { RecommendationsService } from './recommendations.service';
import { CreateRecommendationDto, UpdateBookingStatusDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Recommendations')
@Controller('recommendations')
export class RecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Patch(':id/select')
  @ApiOperation({ summary: '사용자 선택 기록' })
  @ApiResponse({ status: 200, description: '선택 기록 성공' })
  @ApiResponse({ status: 404, description: '추천을 찾을 수 없음' })
  async select(@Param('id') id: number) {
    const result = await this.recommendationsService.select(id);
    return {
      success: true,
      data: {
        id: result.id,
        isSelected: result.isSelected,
        selectedAt: result.selectedAt,
      },
    };
  }
}

@ApiTags('Admin - Recommendations')
@Controller('admin/recommendations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminRecommendationsController {
  constructor(
    private readonly recommendationsService: RecommendationsService,
  ) {}

  @Post()
  @ApiOperation({ summary: '병원 추천 등록 (Admin)' })
  @ApiResponse({ status: 201, description: '등록 성공' })
  @ApiResponse({ status: 404, description: '상담 또는 병원을 찾을 수 없음' })
  @ApiResponse({ status: 409, description: '중복 추천' })
  async create(@Body() createDto: CreateRecommendationDto) {
    const result = await this.recommendationsService.create(createDto);
    return {
      success: true,
      data: {
        ids: result.ids,
      },
      message: `${result.count}건의 병원 추천이 등록되었습니다.`,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '추천 상세 조회 (Admin)' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @ApiResponse({ status: 404, description: '추천을 찾을 수 없음' })
  async findOne(@Param('id') id: number) {
    const result = await this.recommendationsService.findOne(id);
    return {
      success: true,
      data: result,
    };
  }

  @Patch(':id/result')
  @ApiOperation({ summary: '예약 결과 기록 (Admin)' })
  @ApiResponse({ status: 200, description: '기록 성공' })
  @ApiResponse({ status: 404, description: '추천을 찾을 수 없음' })
  async updateBookingStatus(
    @Param('id') id: number,
    @Body() updateDto: UpdateBookingStatusDto,
  ) {
    const result = await this.recommendationsService.updateBookingStatus(
      id,
      updateDto,
    );
    return {
      success: true,
      data: {
        id: result.id,
        bookingStatus: result.bookingStatus,
      },
    };
  }
}
