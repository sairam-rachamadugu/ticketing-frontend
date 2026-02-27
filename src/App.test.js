import { render, screen, fireEvent } from "@testing-library/react";
import App from "./App";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import { configureStore } from "@reduxjs/toolkit";
import seatsReducer from "./seat_redux/seatsSlice";
import { Provider } from "react-redux";

// utility to create a store preloaded with seats
function createTestStore(seats) {
  return configureStore({
    reducer: { seats: seatsReducer },
    preloadedState: {
      seats: { seats, selected: [], totalPrice: 0, status: "idle" },
    },
  });
}

// Wrap with ThemeProvider and Redux provider
function renderWithProviders(ui, { seats } = {}) {
  const store = createTestStore(seats || []);
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {ui}
      </ThemeProvider>
    </Provider>,
  );
}

test("renders header and buy button", () => {
  renderWithProviders(<App />);
  const heading = screen.getByText(/dynamic event ticketing/i);
  expect(heading).toBeInTheDocument();
});

test("displays grid of seats and updates total price on selection", () => {
  // create 100 available seats
  const seats = Array.from({ length: 100 }, (_, i) => ({
    id: i + 1,
    booked: false,
  }));
  renderWithProviders(<App />, { seats });
  // check 100 seat elements rendered (labels A1..J10)
  const seatElements = screen.getAllByText(/[A-J]\d+/);
  expect(seatElements.length).toBe(100);

  // initially buy button disabled and total zero
  const buyBtn = screen.getByRole("button", { name: /buy tickets/i });
  expect(buyBtn).toBeDisabled();
  expect(screen.getByText(/total:/i)).toHaveTextContent("Total: $0");

  // click first two seats (A1, A2)
  fireEvent.click(seatElements[0]);
  fireEvent.click(seatElements[1]);

  // after selection total should update (two seats, first two prices 50 each)
  expect(screen.getByText(/total:/i)).toHaveTextContent("Total: $100");
  expect(buyBtn).toBeEnabled();

  // legend visible
  expect(screen.getByText(/Available/i)).toBeInTheDocument();
  expect(screen.getByText(/Selected/i)).toBeInTheDocument();
  expect(screen.getByText(/Booked/i)).toBeInTheDocument();
});
