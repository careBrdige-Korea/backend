import { ApiProperty } from '@nestjs/swagger';

export class ApiResponseDto<T> {
  @ApiProperty()
  success: boolean;

  @ApiProperty()
  data?: T;

  @ApiProperty()
  message?: string;

  @ApiProperty()
  error?: {
    code: string;
    message: string;
  };
}

export class PaginationMeta {
  @ApiProperty()
  totalItems: number;

  @ApiProperty()
  itemCount: number;

  @ApiProperty()
  itemsPerPage: number;

  @ApiProperty()
  totalPages: number;

  @ApiProperty()
  currentPage: number;
}

export class PaginatedResponseDto<T> {
  @ApiProperty()
  items: T[];

  @ApiProperty()
  meta: PaginationMeta;
}
