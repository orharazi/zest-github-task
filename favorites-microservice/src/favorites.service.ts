// favorites-microservice/src/favorites/favorites.service.ts
import { Injectable, Inject, HttpStatus } from '@nestjs/common';
import { Error, Model } from 'mongoose';
import { responseParams } from './interfaces/response.interface';
import {
  BodyFavoriteDto,
  FavoriteModel,
  QueryFavoriteDto,
} from './dto/favorites.dto';

@Injectable()
export class FavoritesService {
  constructor(
    @Inject('FAVORITE_MODEL')
    private favoriteModel: Model<FavoriteModel>,
  ) {}

  /**
   * Get all user favorites by his uuid
   * @param uuid: string
   * @returns Promise<Favorite[]>
   */
  async getFavoritesByUUID(uuid: string | null): Promise<responseParams> {
    let httpStatus: number;
    let message: string;
    let data: FavoriteModel[] = [];
    try {
      if (uuid) {
        data = await this.favoriteModel
          .find({ uuid })
          .select('repoId repoName');
        message =
          data.length > 0
            ? 'Successfully found user favorites'
            : `Cannot find user with uuid ${uuid}`;
      } else {
        data = [];
        message = 'No uuid provided';
      }

      httpStatus = HttpStatus.OK;
    } catch (e) {
      const error = e as Error;
      const errorMsg = `Cannot find user favorites. Error while running getFavoritesByUUID: ${error.name}: ${error.message}`;
      message = errorMsg;
      httpStatus = HttpStatus.BAD_REQUEST;
    }

    httpStatus >= 400 ? console.error(message) : console.log(message);

    return {
      httpStatus,
      message,
      data,
    };
  }

  /**
   * Create new favorite for user.
   * @param createFavoriteDto BodyFavoriteDto
   * @param uuid string
   * @returns Promise<Favorite>
   */
  async createFavorite(
    createFavoriteDto: BodyFavoriteDto,
    uuid: string,
  ): Promise<responseParams> {
    let httpStatus: number;
    let message: string;
    let data: FavoriteModel;
    try {
      const favoriteAlreadyExist = await this.favoriteModel
        .findOne({
          uuid,
          ...createFavoriteDto,
        })
        .select('repoId repoName');
      if (favoriteAlreadyExist) {
        httpStatus = HttpStatus.CONFLICT;
        message = 'Favorite already exist';
      } else {
        const newFavorite = new this.favoriteModel({
          uuid,
          ...createFavoriteDto,
        });
        data = await newFavorite.save();
        httpStatus = HttpStatus.CREATED;
        message = 'Successfly created new favorite';
      }
    } catch (e) {
      const error = e as Error;
      message = `Cannot create favorites. Error while running createFavorite: ${error.name}: ${error.message}`;
      httpStatus = HttpStatus.BAD_REQUEST;
    }
    httpStatus >= 400 ? console.error(message) : console.log(message);
    return {
      httpStatus,
      message,
      data,
    };
  }

  /**
   * Delete user's favorite by the repoId and uuid
   * @param deleteFavoriteDto QueryFavoriteDto
   * @param uuid string
   * @returns responseParams
   */
  async deleteFavorite(
    deleteFavoriteDto: QueryFavoriteDto,
    uuid: string,
  ): Promise<responseParams> {
    let httpStatus: number;
    let message: string;
    let data: any;
    try {
      const deletedItem = await this.favoriteModel
        .findOneAndDelete({
          uuid,
          ...deleteFavoriteDto,
        })
        .select('repoId repoName');
      if (deletedItem) {
        httpStatus = HttpStatus.ACCEPTED;
        data = deletedItem;
        message = `Successfly delete item with id of: ${deletedItem._id}`;
      } else {
        httpStatus = HttpStatus.BAD_GATEWAY;
        message = `Cannot find item with those fields: ${JSON.stringify(
          deleteFavoriteDto,
        )}`;
      }
    } catch (e) {
      const error = e as Error;
      message = `Cannot delete favorite. Error while running deleteFavorite: ${error.name}: ${error.message}`;
      httpStatus = HttpStatus.BAD_GATEWAY;
    }

    httpStatus >= 400 ? console.error(message) : console.log(message);

    return {
      httpStatus,
      message,
      data,
    };
  }
}
