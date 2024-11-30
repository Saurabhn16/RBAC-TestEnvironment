// Header.js
import React from "react";

const Header = () => {
  return (
    <header style={headerStyle}>
      <h1>RBAC-TestEnvironment</h1>
    </header>
  );
};

// Styling for the header
const headerStyle = {
  backgroundColor: "#4CAF50",
  color: "white",
  padding: "20px",
  textAlign: "center",
};

export default Header;
