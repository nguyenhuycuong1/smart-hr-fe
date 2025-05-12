export interface ApiResponse<T> {
  data: T | null;
  result: Result;
}

export interface Result {
  message: string;
  responseCode: number;
  success: boolean;
}

export interface PageResponse<T> extends ApiResponse<T> {
  dataCount: number;
}
