import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ContactType } from '@prisma/client';

export class CreateConsultationDto {
  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @MaxLength(50)
  userNickname: string;

  @ApiProperty({ enum: ContactType, example: ContactType.KAKAOTALK })
  @IsEnum(ContactType)
  contactType: ContactType;

  @ApiProperty({ example: 'john_doe_kakao' })
  @IsString()
  @MaxLength(100)
  contactInfo: string;

  @ApiPropertyOptional({ example: 'USA' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  nationality?: string;

  @ApiPropertyOptional({ example: 'English' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  language?: string;

  @ApiPropertyOptional({ example: 'Seoul' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  location?: string;

  @ApiPropertyOptional({ example: 'I have a headache and fever' })
  @IsOptional()
  @IsString()
  symptoms?: string;

  @ApiPropertyOptional({ example: '2024-01-15T14:00:00Z' })
  @IsOptional()
  @IsDateString()
  preferredAt?: string;
}
