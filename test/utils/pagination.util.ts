import { Paginated } from '../../src/common/dto/pagination/paginated.dto';

export function createPaginatedResponse<T>(
  items: T[],
  page: number,
  limit: number,
  itemCount: number,
): Paginated<T> {
  const pageCount = Math.ceil(itemCount / limit);
  return {
    items,
    meta: {
      page,
      limit,
      itemCount,
      pageCount,
      hasPreviousPage: page > 1,
      hasNextPage: page < pageCount,
    },
  };
}