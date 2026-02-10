// src/slices/mydetails.slice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axios";

// 🔹 Fetch current user
export const fetchMyDetails = createAsyncThunk(
  "user/fetchMyDetails",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get("/api/v1/users/current-user");
      return res.data?.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

const myDetailsSlice = createSlice({
  name: "mydetails",
  initialState: {
    mydetails: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetMyDetails: (state) => {
      state.mydetails = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.mydetails = action.payload;
      })
      .addCase(fetchMyDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.mydetails = null;
      });
  },
});

export const { resetMyDetails } = myDetailsSlice.actions;
export default myDetailsSlice.reducer;
