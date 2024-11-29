import React from "react";
import { Link, useNavigate } from "react-router-dom";

function TeacherDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");  // Redirect to login page after logout
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Teacher Dashboard</h2>
      
      <div style={{ marginBottom: "20px" }}>
        <Link
          to="/teacher/create-test"
          style={{
            display: "block",
            marginBottom: "10px",
            textDecoration: "none",
            color: "#007bff",
            fontSize: "16px",
          }}
        >
          Create Test
        </Link>
        <Link
          to="/teacher/all-responses"
          style={{
            display: "block",
            marginBottom: "10px",
            textDecoration: "none",
            color: "#007bff",
            fontSize: "16px",
          }}
        >
          View All Responses
        </Link>
      </div>

      <button
        onClick={handleLogout}
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Logout
      </button>
    </div>
  );
}

export default TeacherDashboard;
