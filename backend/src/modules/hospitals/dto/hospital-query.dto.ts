import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional } from 'class-validator';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class HospitalQueryDto extends PaginationDto {
  @ApiPropertyOptional({ example: '서울' })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({ example: '내과' })
  @IsOptional()
  @IsString()
  department?: string;
}
