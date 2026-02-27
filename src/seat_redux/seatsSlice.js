import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API = process.env.React_Seat_URL || "http://localhost:8080";

export const initializeEvent = createAsyncThunk(
  "seats/initialize",
  async () => {
    await axios.post(`${API}/initialize`);
  },
);

export const fetchSeats = createAsyncThunk("seats/fetchSeats", async () => {
  const response = await axios.get(`${API}/seats`);
  return response.data;
});

export const bookSeats = createAsyncThunk(
  "seats/bookSeats",
  async ({ userName, seatIds }) => {
    const response = await axios.post(`${API}/book`, {
      userName,
      seatIds,
    });
    return response.data;
  },
);

const seatsSlice = createSlice({
  name: "seats",
  initialState: {
    seats: [],
    selected: [],
    totalPrice: 0,
    status: "idle",
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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSeats.fulfilled, (state, action) => {
        state.seats = action.payload;
      })
      .addCase(bookSeats.fulfilled, (state) => {
        state.selected = [];
        state.totalPrice = 0;
      });
  },
});

export const { toggleSeat, clearSelection } = seatsSlice.actions;
export default seatsSlice.reducer;
