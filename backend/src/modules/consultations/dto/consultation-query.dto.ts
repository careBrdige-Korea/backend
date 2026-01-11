import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { ConsultationStatus } from '@prisma/client';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class ConsultationQueryDto extends PaginationDto {
  @ApiPropertyOptional({ enum: ConsultationStatus })
  @IsOptional()
  @IsEnum(ConsultationStatus)
  status?: ConsultationStatus;
}
