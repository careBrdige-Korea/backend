import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class UpdateHospitalDto {
  @ApiPropertyOptional({ example: '서울대학교병원 (본원)' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  name?: string;

  @ApiPropertyOptional({ example: '서울' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  region?: string;

  @ApiPropertyOptional({ example: '내과' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  department?: string;

  @ApiPropertyOptional({ example: true })
  @IsOptional()
  @IsBoolean()
  isForeignFriendly?: boolean;
}
