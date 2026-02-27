import seatsReducer, { toggleSeat, clearSelection } from "./seatsSlice";

describe("seatsSlice reducer logic", () => {
  const initialState = {
    seats: [],
    selected: [],
    totalPrice: 0,
    status: "idle",
  };

  it("should handle initial state", () => {
    const next = seatsReducer(undefined, { type: "unknown" });
    expect(next).toEqual(initialState);
  });

  it("toggleSeat adds and removes selection and recalculates price", () => {
    // simulate some sold seats to drive pricing tiers
    const state = {
      ...initialState,
      seats: Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        booked: i < 3,
      })),
    };

    // first toggle seat 4 (available)
    let next = seatsReducer(state, toggleSeat(4));
    expect(next.selected).toEqual([4]);
    // sold count = 3, bookingNumber = 4 => price 50
    expect(next.totalPrice).toBe(50);

    // toggle seat 5 as well
    next = seatsReducer(next, toggleSeat(5));
    expect(next.selected).toEqual([4, 5]);
    // sold =3, bookingNumbers 4 & 5 => 50+50
    expect(next.totalPrice).toBe(100);

    // deselect seat 4
    next = seatsReducer(next, toggleSeat(4));
    expect(next.selected).toEqual([5]);
    expect(next.totalPrice).toBe(50);
  });

  it("clearSelection resets selected and totalPrice", () => {
    const state = { ...initialState, selected: [1, 2, 3], totalPrice: 150 };
    const next = seatsReducer(state, clearSelection());
    expect(next.selected).toEqual([]);
    expect(next.totalPrice).toBe(0);
  });
});
