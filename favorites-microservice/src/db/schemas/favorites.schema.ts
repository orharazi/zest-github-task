import * as mongoose from 'mongoose';

export const FavoriteSchema = new mongoose.Schema({
  uuid: { type: String, required: true },
  repoId: { type: String, required: true },
  repoName: { type: String, required: true },
});
