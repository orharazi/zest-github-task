import { HttpStatusCode } from "axios";
import { status } from "./types";

export interface FavoriteType extends FavoriteParams {
  _id?: string;
}

export interface FavoriteParams {
  repoId: number;
  repoName?: string;
}

export interface FavoritesState {
  entities: FavoriteType[];
  status: status;
  error: string | null;
}

export interface FetchFavoritesApiResponse {
  httpStatus: HttpStatusCode;
  message: string;
  data: FavoriteType[];
}

export interface singelFavoritesApiResponse {
  httpStatus: HttpStatusCode;
  message: string;
  data: FavoriteType;
}
