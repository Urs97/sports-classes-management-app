import { ApiProperty } from '@nestjs/swagger';

import { PageMetaParameters } from '../../interfaces/page-meta-parameters.interface';

export class PaginationMetaDto {
  @ApiProperty()
  readonly page: number;

  @ApiProperty()
  readonly limit: number;

  @ApiProperty()
  readonly itemCount: number;

  @ApiProperty()
  readonly pageCount: number;

  @ApiProperty()
  readonly hasPreviousPage: boolean;

  @ApiProperty()
  readonly hasNextPage: boolean;

  constructor({ paginationOptionsDto, count }: PageMetaParameters) {
    this.page = paginationOptionsDto.page;
    this.limit = paginationOptionsDto.limit;
    this.itemCount = count;
    this.pageCount = Math.ceil(this.itemCount / this.limit);
    this.hasPreviousPage = this.page > 1;
    this.hasNextPage = this.page < this.pageCount;
  }
}
