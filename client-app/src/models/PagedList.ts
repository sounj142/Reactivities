export interface PagedList<T> {
  currentPage: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
  data: T[];
}

export function emptyPagedList<T>(pageSize: number): PagedList<T> {
  return {
    currentPage: 1,
    pageSize: pageSize,
    totalCount: 1,
    totalPages: 1,
    hasPreviousPage: false,
    hasNextPage: false,
    data: [],
  };
}
