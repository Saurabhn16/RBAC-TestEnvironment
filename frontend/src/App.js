import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import TeacherDashboard from "./components/TeacherDashboard";
import StudentDashboard from "./components/StudentDashboard";
import CreateTest from "./components/CreateTest";
import AttemptTest from "./components/AttemptTest";
import AddStudent from "./components/AddStudent";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard"; // Importing the missing Dashboard component
import AllResponses from "./components/AllResponses";

// PrivateRoute component to handle authentication check
const PrivateRoute = ({ element, role, requiredRole }) => {
  return role === requiredRole ? element : <Navigate to="/login" />;
};

function App() {
  const [authToken, setAuthToken] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true); // New loading state

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

  // Check if user is authenticated
  const isAuthenticated = () => !!authToken;

  if (loading) {
    // You can show a loading spinner or a simple text while loading the auth data
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Default route */}
        <Route
          path="/"
          element={isAuthenticated() ? (
            <Navigate to={userRole === "teacher" ? "/teacher" : "/student"} />
          ) : (
            <Navigate to="/login" />
          )}
        />

        {/* Login and Signup */}
        <Route path="/login" element={<Login setAuthToken={setAuthToken} setUserRole={setUserRole} />} />
        <Route path="/signup" element={<Signup />} />

        {/* Teacher Routes */}
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

        {/* Student Routes */}
        <Route
          path="/student"
          element={<PrivateRoute element={<StudentDashboard />} role={userRole} requiredRole="student" />}
        />
        <Route
          path="/student/attempt-test/:id"
          element={<PrivateRoute element={<AttemptTest />} role={userRole} requiredRole="student" />}
        />
                <Route
          path="/teacher/all-responses"
          element={<PrivateRoute element={<AllResponses />} role={userRole} requiredRole="teacher" />}
        />
      </Routes>
    </Router>
  );
}

export default App;
