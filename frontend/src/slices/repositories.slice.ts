import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { fetchData } from "../utils/api";
import {
  RepositoriesParams,
  RepositoriesApiResponse,
  RepositoriesState,
} from "../types/repositories.type";

const REPOSITORIES_PORT = 3000;

const initialState: RepositoriesState = {
  entities: [],
  status: "idle",
  error: null,
};

export const fetchRepos = createAsyncThunk(
  "repo/getRepos",
  async (
    {
      endpoint,
      params,
    }: {
      endpoint: string;
      params: RepositoriesParams;
    },
    { rejectWithValue }
  ) => {
    const data = await fetchData(REPOSITORIES_PORT, endpoint, { params });
    if (data.data) {
      return data;
    } else {
      return rejectWithValue("Cannot get repositories data");
    }
  }
);

const dataSlice = createSlice({
  name: "repo",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRepos.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        fetchRepos.fulfilled,
        (state, action: PayloadAction<RepositoriesApiResponse>) => {
          state.status = "succeeded";
          if (action.payload.page && action.payload.page > 1) {
            // if we got page that is not the first, add to entities
            state.entities = [...state.entities, ...action.payload.data];
          } else {
            // else, rewrite
            state.entities = action.payload.data;
          }
        }
      )
      .addCase(fetchRepos.rejected, (state, action) => {
        state.status = "failed";
        console.log(action.payload);
        state.error = String(action.payload) ?? "An error occurred";
      });
  },
});

export default dataSlice.reducer;
