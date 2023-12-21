import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./slices/favorites.slice";
import repositoriesReducer from "./slices/repositories.slice";

export const store = configureStore({
  reducer: {
    favorites: favoritesReducer,
    repositories: repositoriesReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
