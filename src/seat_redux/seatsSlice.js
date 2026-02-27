import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.React_Seat_URL || "http://localhost:8080";

export const initializeEvent = createAsyncThunk(
  "seats/initialize",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post(`${API}/initialize`);
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to initialize event";
      return rejectWithValue(message);
    }
  },
);

export const fetchSeats = createAsyncThunk(
  "seats/fetchSeats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API}/seats`);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || "Failed to fetch seats";
      return rejectWithValue(message);
    }
  },
);

export const bookSeats = createAsyncThunk(
  "seats/bookSeats",
  async ({ userName, seatIds }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API}/book`, {
        userName,
        seatNumbers: seatIds, // match backend
      });
      return response.data; // total price
    } catch (err) {
      const message = err.response?.data?.message || "Booking failed";
      return rejectWithValue(message);
    }
  },
);

const seatsSlice = createSlice({
  name: "seats",
  initialState: {
    seats: [],
    selected: [],
    totalPrice: 0,
    status: "idle",
    error: null,
  },
  reducers: {
    toggleSeat: (state, action) => {
      const id = action.payload;
      if (state.selected.includes(id)) {
        state.selected = state.selected.filter((s) => s !== id);
      } else {
        state.selected.push(id);
      }

      const sold = state.seats.filter((s) => s.booked).length;
      let total = 0;

      for (let i = 0; i < state.selected.length; i++) {
        const bookingNumber = sold + i + 1;
        if (bookingNumber <= 50) total += 50;
        else if (bookingNumber <= 80) total += 75;
        else total += 100;
      }

      state.totalPrice = total;
    },
    clearSelection: (state) => {
      state.selected = [];
      state.totalPrice = 0;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.seats = action.payload;
        state.error = null;
      })
      .addCase(fetchSeats.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Initialize Event
      .addCase(initializeEvent.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(initializeEvent.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Book Seats
      .addCase(bookSeats.fulfilled, (state) => {
        state.selected = [];
        state.totalPrice = 0;
        state.error = null;
      })
      .addCase(bookSeats.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { toggleSeat, clearSelection, clearError } = seatsSlice.actions;
export default seatsSlice.reducer;
