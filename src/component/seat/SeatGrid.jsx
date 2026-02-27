import React from "react";
import { useDispatch } from "react-redux";
import { toggleSeat } from "../../seat_redux/seatsSlice";
import { Box, Paper, useTheme } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

function SeatGrid({ seats, selected }) {
  const dispatch = useDispatch();
  const theme = useTheme();

  // build a fixed array of 100 seat definitions,
  // using backend data where available and defaulting to unbooked.
  // const seatList = Array.from({ length: 100 }, (_, idx) => {
  //   return { id: idx + 1, ...seats[idx] };
  // });
  // console.log("SeatGrid render - seats:", seatList, "selected:", selected);
  const getLabel = (id) => {
    // console.log("getLabel called for id:", id);
    const row = Math.floor((id - 1) / 10);
    const col = ((id - 1) % 10) + 1;
    const letter = String.fromCharCode(65 + row);
    return `${letter}${col}`;
  };

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "repeat(auto-fit, minmax(30px, 1fr))",
          sm: "repeat(10, 1fr)",
        },
        gap: 1,
        maxWidth: 600,
        margin: "0 auto",
        mb: 7,
      }}
    >
      {seats.map((seat, index) => {
        const booked = seat.booked;
        const picked = selected.includes(index + 1);
        const bgColor = booked
          ? theme.palette.grey[500]
          : picked
            ? theme.palette.success.main
            : theme.palette.background.paper;

        return (
          <Paper
            key={seat.id}
            elevation={2}
            onClick={() => !booked && dispatch(toggleSeat(index + 1))}
            aria-label={`Seat ${getLabel(index + 1)} ${booked ? "booked" : "available"}`}
            sx={{
              height: 40,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: bgColor,
              border: `1px solid ${theme.palette.divider}`,
              cursor: booked ? "not-allowed" : "pointer",
              userSelect: "none",
              transition: "transform 0.15s",
              "&:hover": {
                transform: booked ? "none" : "scale(1.1)",
              },
              fontSize: "0.75rem",
              position: "relative",
            }}
          >
            {picked ? (
              <CheckCircleIcon
                sx={{ color: theme.palette.common.white, fontSize: 18 }}
              />
            ) : (
              getLabel(index + 1)
            )}
          </Paper>
        );
      })}
    </Box>
  );
}

export default SeatGrid;
