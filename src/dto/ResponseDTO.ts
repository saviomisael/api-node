export interface ResponseDTO<T> {
  errors: string[];
  success: boolean;
  data: T[];
}
