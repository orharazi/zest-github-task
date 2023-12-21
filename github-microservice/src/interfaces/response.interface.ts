import { HttpStatus } from '@nestjs/common';
import { RequestParameters } from '@octokit/types';

export interface responseParams {
  httpStatus: HttpStatus;
  message: string;
  data: any;
  page?: number;
}

export interface ParamsForRepositoriesSearch extends RequestParameters {
  q: string;
  sort?: 'updated' | 'stars' | 'forks' | 'help-wanted-issues';
  order?: 'desc' | 'asc';
  per_page?: number;
  page?: number;
}
