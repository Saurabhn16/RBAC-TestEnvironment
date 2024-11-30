import React from "react";
import { Link, useNavigate } from "react-router-dom";

function TeacherDashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");  // Redirect to login page after logout
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>Teacher Dashboard</h2>
      </div>

      <div style={styles.linksContainer}>
        <Link to="/teacher/create-test" style={styles.link}>
          Create Test
        </Link>
        <Link to="/teacher/all-responses" style={styles.link}>
          View All Responses
        </Link>
      </div>

      <button onClick={handleLogout} style={styles.logoutButton}>
        Logout
      </button>
    </div>
  );
}

const styles = {
  container: {
    padding: "30px",
    maxWidth: "900px",
    margin: "auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  header: {
    marginBottom: "20px",
    borderBottom: "2px solid #007bff",
    paddingBottom: "10px",
  },
  title: {
    color: "#007bff",
    fontSize: "28px",
    fontWeight: "600",
  },
  linksContainer: {
    marginBottom: "30px",
  },
  link: {
    display: "block",
    marginBottom: "15px",
    textDecoration: "none",
    color: "#007bff",
    fontSize: "18px",
    fontWeight: "500",
    transition: "color 0.3s, transform 0.3s",
  },
  linkHover: {
    color: "#0056b3",
    transform: "scale(1.05)",
  },
  logoutButton: {
    padding: "12px 24px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    fontWeight: "500",
    transition: "background-color 0.3s, transform 0.3s",
  },
};

export default TeacherDashboard;
