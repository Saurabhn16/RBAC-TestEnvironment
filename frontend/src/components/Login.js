import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = ({ setAuthToken, setUserRole }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        username,
        password,
      });
      const { token, role } = response.data;

      localStorage.setItem("authToken", token);
      localStorage.setItem("userRole", role);

      setAuthToken(token);
      setUserRole(role);

      setMessage("Login successful!");
      navigate(role === "teacher" ? "/teacher" : "/student");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to login.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Username:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Login;
