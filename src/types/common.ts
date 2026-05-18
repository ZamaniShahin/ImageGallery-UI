export interface Paged<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages?: number;
  hasNext?: boolean;
  hasPrevious?: boolean;
}

export interface PagedQuery {
  page?: number;
  pageSize?: number;
  search?: string;
}
