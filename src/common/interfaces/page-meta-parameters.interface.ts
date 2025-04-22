import { PaginationOptionsDto } from '../dto/pagination/pagination-options.dto';

export interface PageMetaParameters {
  paginationOptionsDto: PaginationOptionsDto;
  count: number;
}
