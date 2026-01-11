import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsEnum, IsOptional } from 'class-validator';
import { ConsultationStatus } from '@prisma/client';

export class UpdateConsultationDto {
  @ApiPropertyOptional({ enum: ConsultationStatus })
  @IsOptional()
  @IsEnum(ConsultationStatus)
  status?: ConsultationStatus;

  @ApiPropertyOptional({ example: '환자 연락 완료, 병원 추천 예정' })
  @IsOptional()
  @IsString()
  adminMemo?: string;
}
