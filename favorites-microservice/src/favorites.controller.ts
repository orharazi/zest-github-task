// favorites-microservice/src/favorites/favorites.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Delete,
  Res,
  ValidationPipe,
  Query,
  Req,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { v4 as uuidv4 } from 'uuid';
import { FavoritesService } from './favorites.service';
import { BodyFavoriteDto, QueryFavoriteDto } from './dto/favorites.dto';
import { Response, Request } from 'express';

@Controller('favorites')
export class FavoritesController {
  constructor(
    private readonly favoritesService: FavoritesService,
    private jwtService: JwtService,
  ) {}

  @Get()
  async getFavoritesBuUUID(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    let uuid;

    if (req.cookies['jwt']) {
      // Get uuid from jwt
      const cookie = req.cookies['jwt'];
      const jwtData = await this.jwtService.verifyAsync(cookie);
      uuid = jwtData.uuid;
    } else {
      // Generate uuid and jwt token for new users
      uuid = uuidv4();
      const jwt = await this.jwtService.signAsync({ uuid });
      res.cookie('jwt', jwt);
    }

    const { httpStatus, message, data } =
      await this.favoritesService.getFavoritesByUUID(uuid);

    return res.status(httpStatus).json({ data, message });
  }

  @Post('addFavorite')
  async addFavorite(
    @Body(new ValidationPipe()) body: BodyFavoriteDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    // Get uuid from jwt
    const cookie = req.cookies['jwt'];
    const jwtData = await this.jwtService.verifyAsync(cookie);

    if (jwtData) {
      const { httpStatus, message, data } =
        await this.favoritesService.createFavorite(body, jwtData.uuid);
      return res.status(httpStatus).json({ data, message });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({});
    }
  }

  @Delete('deleteFavorite')
  async deleteFavorite(
    @Query(new ValidationPipe()) params: QueryFavoriteDto,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<Response> {
    // Get uuid from jwt
    const cookie = req.cookies['jwt'];
    const jwtData = await this.jwtService.verifyAsync(cookie);

    if (jwtData) {
      const { httpStatus, message, data } =
        await this.favoritesService.deleteFavorite(params, jwtData.uuid);
      return res.status(httpStatus).json({ data, message });
    } else {
      return res.status(HttpStatus.UNAUTHORIZED).json({});
    }
  }
}
