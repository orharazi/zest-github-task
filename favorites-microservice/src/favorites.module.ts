import { Module } from '@nestjs/common';
import { FavoritesController } from './favorites.controller';
import { FavoritesService } from './favorites.service';
import { DatabaseModule } from './db/database.module';
import { favoritesProviders } from './favorites.providers';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      global: true,
      secret: 'secret', // It should be in differnet file but just for the example..
      signOptions: { expiresIn: '70d' }, // Just for the example..
    }),
  ],
  controllers: [FavoritesController],
  providers: [FavoritesService, ...favoritesProviders],
})
export class AppModule {}
