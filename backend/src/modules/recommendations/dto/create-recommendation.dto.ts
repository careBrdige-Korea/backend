import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsArray, ArrayMinSize, ArrayMaxSize } from 'class-validator';

export class CreateRecommendationDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  consultationId: number;

  @ApiProperty({ example: [1, 2, 3], description: '추천할 병원 ID 목록 (1~3개)' })
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(3)
  @IsNumber({}, { each: true })
  hospitalIds: number[];
}
