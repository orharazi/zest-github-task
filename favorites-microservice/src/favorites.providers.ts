import { Connection } from 'mongoose';
import { FavoriteSchema } from './db/schemas/favorites.schema';

// Connect to mongoDB

export const favoritesProviders = [
  {
    provide: 'FAVORITE_MODEL',
    useFactory: (connection: Connection) =>
      connection.model('favorite', FavoriteSchema),
    inject: ['DATABASE_CONNECTION'],
  },
];
