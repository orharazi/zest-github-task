import { IsOptional, IsString } from 'class-validator';

export class getTopRepositoriesDto {
  @IsString()
  readonly page: string | number;

  @IsOptional()
  @IsString()
  readonly repoName?: string;
}

export class getRepositoryDto {
  @IsString()
  readonly id: string;
}
