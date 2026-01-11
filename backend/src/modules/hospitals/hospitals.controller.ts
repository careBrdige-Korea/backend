import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
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
import { HospitalsService } from './hospitals.service';
import { CreateHospitalDto, UpdateHospitalDto, HospitalQueryDto } from './dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Admin - Hospitals')
@Controller('admin/hospitals')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@ApiBearerAuth()
export class HospitalsController {
  constructor(private readonly hospitalsService: HospitalsService) {}

  @Post()
  @ApiOperation({ summary: '병원 등록 (Admin)' })
  @ApiResponse({ status: 201, description: '등록 성공' })
  async create(@Body() createDto: CreateHospitalDto) {
    const result = await this.hospitalsService.create(createDto);
    return {
      success: true,
      data: result,
    };
  }

  @Get()
  @ApiOperation({ summary: '병원 목록 조회 (Admin)' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  async findAll(@Query() queryDto: HospitalQueryDto) {
    const result = await this.hospitalsService.findAll(queryDto);
    return {
      success: true,
      data: result,
    };
  }

  @Get(':id')
  @ApiOperation({ summary: '병원 상세 조회 (Admin)' })
  @ApiResponse({ status: 200, description: '조회 성공' })
  @ApiResponse({ status: 404, description: '병원을 찾을 수 없음' })
  async findOne(@Param('id') id: number) {
    const result = await this.hospitalsService.findOne(id);
    return {
      success: true,
      data: result,
    };
  }

  @Patch(':id')
  @ApiOperation({ summary: '병원 정보 수정 (Admin)' })
  @ApiResponse({ status: 200, description: '수정 성공' })
  @ApiResponse({ status: 404, description: '병원을 찾을 수 없음' })
  async update(@Param('id') id: number, @Body() updateDto: UpdateHospitalDto) {
    const result = await this.hospitalsService.update(id, updateDto);
    return {
      success: true,
      data: result,
    };
  }

  @Delete(':id')
  @ApiOperation({ summary: '병원 삭제 (Admin)' })
  @ApiResponse({ status: 200, description: '삭제 성공' })
  @ApiResponse({ status: 404, description: '병원을 찾을 수 없음' })
  async remove(@Param('id') id: number) {
    const result = await this.hospitalsService.remove(id);
    return {
      success: true,
      message: result.message,
    };
  }
}
