import { IsNumber, IsNumberString, IsString } from 'class-validator';
import { Document } from 'mongoose';

export interface FavoriteModel extends Document {
  uuid: string;
  readonly repoId: string;
  readonly repoName: string;
}

export class BodyFavoriteDto {
  @IsNumber()
  readonly repoId: number;

  @IsString()
  readonly repoName: string;
}

export class QueryFavoriteDto {
  @IsNumberString()
  readonly repoId: number;
}
