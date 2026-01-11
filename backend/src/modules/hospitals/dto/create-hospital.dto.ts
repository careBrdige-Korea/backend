import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, MaxLength } from 'class-validator';

export class CreateHospitalDto {
  @ApiProperty({ example: '서울대학교병원' })
  @IsString()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: '서울' })
  @IsString()
  @MaxLength(50)
  region: string;

  @ApiProperty({ example: '내과' })
  @IsString()
  @MaxLength(50)
  department: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isForeignFriendly?: boolean;
}
