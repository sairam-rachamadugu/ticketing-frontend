import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initializeEvent,
  fetchSeats,
  bookSeats,
  clearSelection,
} from "./seat_redux/seatsSlice";
import SeatGrid from "./component/seat/SeatGrid";
import {
  Container,
  Typography,
  Button,
  Box,
  AppBar,
  Toolbar,
} from "@mui/material";

function App() {
  const dispatch = useDispatch();
  const { seats, selected, totalPrice } = useSelector((state) => state.seats);

  useEffect(() => {
    dispatch(initializeEvent()).then(() => {
      dispatch(fetchSeats());
    });
  }, [dispatch]);

  const handleBuy = async () => {
    await dispatch(bookSeats({ userName: "User", seatIds: selected }));
    dispatch(fetchSeats());
    dispatch(clearSelection());
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Dynamic Event Ticketing
          </Typography>
        </Toolbar>
      </AppBar>
      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container component="Paper" elevation={3} sx={{ py: 4 }}>
          <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
            Choose your seats below. Click multiple seats then press Buy
            Tickets.
          </Typography>
          <Box>
            <SeatGrid seats={seats} selected={selected} />
            <Box
              sx={{
                width: "100%",
                borderRadius: 1,

                position: "fixed",
                bottom: 0,
                margin: 0,
                padding: "16px",
                color: "white",
                textAlign: "center",
                zIndex: 1000,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                bgcolor: "primary.main",
              }}
            >
              {/* legend */}
              <Box mt={2} display="flex" alignItems="center" gap={2}>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "background.paper",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <Typography>Available</Typography>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "success.main",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <Typography>Selected</Typography>
                <Box
                  sx={{
                    width: 20,
                    height: 20,
                    bgcolor: "grey.500",
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                />
                <Typography>Booked</Typography>
              </Box>
              <Box
                mt={3}
                display="flex"
                alignItems="center"
                gap={2}
                flexWrap="wrap"
              >
                <Typography variant="h6">Total: ${totalPrice}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleBuy}
                  disabled={!selected.length}
                >
                  Buy Tickets
                </Button>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}

export default App;
