import * as mongoose from 'mongoose';

export const databaseProviders = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: (): Promise<typeof mongoose> =>
      mongoose.connect(
        'mongodb+srv://zestAdmin:oDVHN2kF3W4JQzgi@cluster0.mbxpssv.mongodb.net/zest?retryWrites=true&w=majority',
      ),
  },
];
