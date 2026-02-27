import React from "react";
import { clearError } from "../seat_redux/seatsSlice";
import { useDispatch, useSelector } from "react-redux";

const ErrorPopup = () => {
  const dispatch = useDispatch();
  const error = useSelector((state) => state.seats.error);
  console.log("ErrorPopup render - error:", error);
  if (!error) return null;

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h3 style={{ color: "red" }}>Error</h3>
        <p>{error}</p>
        <button onClick={() => dispatch(clearError())}>Close</button>
      </div>
    </div>
  );
};

const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 999,
};

const popupStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  minWidth: "300px",
  textAlign: "center",
};

export default ErrorPopup;
