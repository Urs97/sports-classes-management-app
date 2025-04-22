import { ApiProperty } from '@nestjs/swagger';

import { PaginationMetaDto } from './pagination-meta.dto';
import { PaginationOptionsDto } from './pagination-options.dto';

export class Paginated<T> {
  @ApiProperty({ isArray: true })
  items: T[];
  @ApiProperty()
  meta: PaginationMetaDto;

  constructor(
    items: T[],
    paginationOptionsDto: PaginationOptionsDto,
    count: number,
  ) {
    const meta = new PaginationMetaDto({ paginationOptionsDto, count });
    this.items = items;
    this.meta = meta;
  }
}
