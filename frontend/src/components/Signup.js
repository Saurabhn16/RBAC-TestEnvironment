import React, { useState } from "react";
import axios from "axios";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student"); // Default role to "student"
  const [message, setMessage] = useState(""); // Message state to display success or error messages

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/signup", {
        username,
        password,
        role,
      });

      setMessage(response.data.message); // Set the message from the response
    } catch (error) {
      setMessage(error.response ? error.response.data.message : "Error signing up"); // Handle errors
    }
  };

  return (
    <div>
      <h2>Signup</h2>
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
        <div>
          <label>Role:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="teacher">Teacher</option>
            <option value="student">Student</option>
          </select>
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p> {/* Display the message to the user */}
    </div>
  );
};

export default Signup;
