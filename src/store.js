import { configureStore } from "@reduxjs/toolkit";
import seatsReducer from "./seat_redux/seatsSlice";

export const store = configureStore({
  reducer: {
    seats: seatsReducer,
  },
});
