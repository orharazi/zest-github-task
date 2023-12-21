import { HttpStatus } from '@nestjs/common';

export interface responseParams {
  httpStatus: HttpStatus;
  message: string;
  data: any;
}
