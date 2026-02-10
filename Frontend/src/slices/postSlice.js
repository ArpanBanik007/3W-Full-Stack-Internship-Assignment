// src/slices/postSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axios";

// 🔹 Fetch my posts
export const fetchMyPosts = createAsyncThunk(
  "posts/fetchMyPosts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/posts/my-posts");
      return res.data?.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch posts"
      );
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {
    resetMyPosts: (state) => {
      state.posts = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchMyPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetMyPosts } = postSlice.actions;
export default postSlice.reducer;
