import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ConsultationsService } from './consultations.service';
import {
  CreateConsultationDto,
  UpdateConsultationDto,
  ConsultationQueryDto,
} from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Consultations')
@Controller('consultations')
export class ConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Post()
  @ApiOperation({ summary: '상담 접수 (비회원 가능)' })
  @ApiResponse({ status: 201, description: '상담 접수 성공' })
  async create(@Body() createDto: CreateConsultationDto) {
    const result = await this.consultationsService.create(createDto);
    return {
      success: true,
      data: {
        id: Number(result.id),
        userNickname: result.userNickname,
        status: result.status,
        createdAt: result.createdAt,
      },
      message: '상담이 접수되었습니다.',
    };
  }
}

@ApiTags('Admin - Consultations')
@Controller('admin/consultations')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class AdminConsultationsController {
  constructor(private readonly consultationsService: ConsultationsService) {}

  @Get()
  @ApiOperation({ summary: '상담 목록 조회 (Admin)' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  async findAll(@Query() queryDto: ConsultationQueryDto) {
    const result = await this.consultationsService.findAll(queryDto);
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '상담 상세 조회 (Admin)' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @ApiResponse({ status: 404, description: '상담을 찾을 수 없음' })
  async findOne(@Param('id') id: number) {
    const result = await this.consultationsService.findOne(id);
    return {
      success: true,
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '상담 상태/메모 수정 (Admin)' })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 404, description: '상담을 찾을 수 없음' })
  async update(
    @Param('id') id: number,
    @Body() updateDto: UpdateConsultationDto,
  ) {
    const result = await this.consultationsService.update(id, updateDto);
    return {
      success: true,
      data: {
        id: result.id,
        status: result.status,
        adminMemo: result.adminMemo,
      },
    };
  }
}
