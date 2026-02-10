// src/slices/follow.slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axios";

// 🔹 Fetch my followings
export const fetchMyFollowings = createAsyncThunk(
  "follow/fetchMyFollowings",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(
        "/api/v1/users/interactions/myfollowing"
      );
      return res.data?.followings || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch followings"
      );
    }
  }
);

const followSlice = createSlice({
  name: "follow",
  initialState: {
    followings: [],
    loading: false,
    error: null,
  },
  reducers: {
    addFollowing: (state, action) => {
      const id = action.payload;
      if (!state.followings.includes(id)) {
        state.followings.push(id);
      }
    },
    removeFollowing: (state, action) => {
      state.followings = state.followings.filter(
        (id) => id !== action.payload
      );
    },
    resetFollowings: (state) => {
      state.followings = [];
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyFollowings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyFollowings.fulfilled, (state, action) => {
        state.loading = false;
        state.followings = action.payload;
      })
      .addCase(fetchMyFollowings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  addFollowing,
  removeFollowing,
  resetFollowings,
} = followSlice.actions;

export default followSlice.reducer;
