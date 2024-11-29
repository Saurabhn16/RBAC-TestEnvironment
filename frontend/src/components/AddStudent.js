import React, { useState } from "react";
import axios from "axios";

const AddStudent = ({ userRole }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const token = localStorage.getItem("authToken");

  // Only allow teachers to add students
  if (userRole !== "teacher") {
    return <p>You must be a teacher to add students.</p>;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("Please log in to add a student.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/signup", // Using the same signup API to create a student
        { username: name, password, role: "student" },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(response.data.message);
    } catch (error) {
      setMessage(error.response ? error.response.data.message : "Error adding student");
    }
  };

  return (
    <div>
      <h2>Add Student</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <button type="submit">Add Student</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default AddStudent;
