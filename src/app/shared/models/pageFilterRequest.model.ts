export interface PageFilterRequest<T> {
  pageNumber: number;
  pageSize: number;
  filter?: T;
  sortProperty?: string;
  sortOrder?: string;
  common?: string;
}
