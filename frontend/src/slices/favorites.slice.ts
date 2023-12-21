import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createItem, deleteItem, fetchData } from "../utils/api";
import {
  FetchFavoritesApiResponse,
  FavoritesState,
  FavoriteParams,
  singelFavoritesApiResponse,
} from "../types/favorite.type";

const FAVORITES_PORT = 3001;

const initialState: FavoritesState = {
  entities: [],
  status: "idle",
  error: null,
};

export const fetchFavorites = createAsyncThunk(
  "favorites/getFavorites",
  async ({ endpoint }: { endpoint: string }, { rejectWithValue }) => {
    const data = await fetchData(FAVORITES_PORT, endpoint);
    if (data.data) {
      return data;
    } else {
      return rejectWithValue("Cannot get user favorite");
    }
  }
);

export const createFavorite = createAsyncThunk(
  "favorites/postFavorite",
  async (
    {
      endpoint,
      params,
    }: {
      endpoint: string;
      params: FavoriteParams;
    },
    { rejectWithValue }
  ) => {
    const data = await createItem(FAVORITES_PORT, endpoint, params);
    if (data.data) {
      return data;
    } else {
      return rejectWithValue("Cannot create favorite");
    }
  }
);

export const deleteFavorite = createAsyncThunk(
  "favorites/deleteFavorite",
  async (
    {
      endpoint,
      params,
    }: {
      endpoint: string;
      params: FavoriteParams;
    },
    { rejectWithValue }
  ) => {
    const data = await deleteItem(FAVORITES_PORT, endpoint, { params });
    if (data.data) {
      return data;
    } else {
      return rejectWithValue("Cannot delete favorite");
    }
  }
);

const dataSlice = createSlice({
  name: "favorites",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      // fetchFavorites all cases
      .addCase(fetchFavorites.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchFavorites.fulfilled,
        (state, action: PayloadAction<FetchFavoritesApiResponse>) => {
          state.status = "succeeded";
          state.entities = action.payload.data;
        }
      )
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          String(action.payload) ?? "An error occurred while fetchFavorites";
      })

      // createFavorites all cases
      .addCase(createFavorite.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        createFavorite.fulfilled,
        (state, action: PayloadAction<singelFavoritesApiResponse>) => {
          state.status = "succeeded";
          state.entities = [...state.entities, action.payload.data];
        }
      )
      .addCase(createFavorite.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          String(action.payload) ?? "An error occurred while createFavorites";
      })

      // deleteFavorites all cases
      .addCase(deleteFavorite.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        deleteFavorite.fulfilled,
        (state, action: PayloadAction<singelFavoritesApiResponse>) => {
          state.status = "succeeded";
          state.entities = state.entities.filter(
            (_) => _._id !== action.payload.data._id
          );
        }
      )
      .addCase(deleteFavorite.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          String(action.payload) ?? "An error occurred while deleteFavorites";
      });
  },
});

export default dataSlice.reducer;
