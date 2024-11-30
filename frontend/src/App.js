import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Importing components for different routes
import Login from "./components/Login";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import CreateTest from "./components/CreateTest";
import AttemptTest from "./components/AttemptTest";
import AddStudent from "./components/AddStudent";
import Signup from "./components/Signup";
import AllResponses from "./components/AllResponses";
import Header from "./components/Header";  // Import the Header component

// PrivateRoute component to handle role-based authentication check
const PrivateRoute = ({ element, role, requiredRole }) => {
  return role === requiredRole ? element : <Navigate to="/login" />;
};

function App() {
  // State variables to store authentication token and user role
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // Loading state to manage authentication status

  // useEffect hook to fetch stored authentication data (token and role) from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedRole = localStorage.getItem("userRole");

    if (storedToken) {
      setAuthToken(storedToken);
    }
    if (storedRole) {
      setUserRole(storedRole);
    }
    setLoading(false); // Set loading to false once the state is updated
  }, []);

  // Function to check if the user is authenticated
  const isAuthenticated = () => !!authToken;

  if (loading) {
    // Show a loading message while the authentication data is being loaded
    return <div>Loading...</div>;
  }

  return (
    <>
      <Router>
        {/* Include the Header component */}
        <Header />
        <Routes>
          {/* Default route to navigate based on user authentication and role */}
          <Route
            path="/"
            element={isAuthenticated() ? (
              <Navigate to={userRole === "teacher" ? "/teacher" : "/student"} />
            ) : (
              <Navigate to="/login" />
            )}
          />

          {/* Login and Signup routes */}
          <Route path="/login" element={<Login setAuthToken={setAuthToken} setUserRole={setUserRole} />} />
          <Route path="/signup" element={<Signup />} />

          {/* Teacher-specific routes */}
          <Route
            path="/teacher"
            element={<PrivateRoute element={<TeacherDashboard />} role={userRole} requiredRole="teacher" />}
          />
          <Route
            path="/teacher/create-test"
            element={<PrivateRoute element={<CreateTest />} role={userRole} requiredRole="teacher" />}
          />
          <Route
            path="/teacher/add-student"
            element={<PrivateRoute element={<AddStudent />} role={userRole} requiredRole="teacher" />}
          />
          <Route
            path="/teacher/all-responses"
            element={<PrivateRoute element={<AllResponses />} role={userRole} requiredRole="teacher" />}
          />

          {/* Student-specific routes */}
          <Route
            path="/student"
            element={<PrivateRoute element={<StudentDashboard />} role={userRole} requiredRole="student" />}
          />
          <Route
            path="/student/attempt-test/:id"
            element={<PrivateRoute element={<AttemptTest />} role={userRole} requiredRole="student" />}
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
