export interface BaseResponse {
  code: number;
  message?: string;
  error?: boolean;
  result?: object | Array<unknown> | string;
}
