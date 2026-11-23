import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import API from "../../services/HotelApi";

export const fetchHotels = createAsyncThunk(
  "hotels/fetchHotels",
  async (filters) => {
    const response = await API.get("/", {
      params: filters
    });

    return response.data;
  }
);

const initialState = {
    hotels: [],
    pagination: {},
    loading: false,
    error: null
};

const hotelSlice = createSlice({
    name: "hotels",
    initialState,
    reducers: {},

    extraReducers: (builder) => {
        builder
            .addCase(fetchHotels.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(fetchHotels.fulfilled, (state, action) => {
                state.loading = false;
                state.hotels = action.payload.hotels;
                state.pagination = action.payload.pagination;
            })

            .addCase(fetchHotels.rejected, (state) => {
                state.loading = false;
                state.error = "Failed to fetch hotels";
            });

    }
});

export default hotelSlice.reducer;
