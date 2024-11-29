import React, { useState, useEffect } from "react";
import axios from "axios";

function AllResponses() {
  const [responses, setResponses] = useState([]);
  const [students, setStudents] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem("authToken");

        // Early return if no token
        if (!token) {
          setError("No authorization token found. Please log in.");
          setLoading(false);
          return;
        }

        // Fetch responses
        const response = await axios.get("http://localhost:5000/api/teacher/test-responses", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(studentPromises);
        setResponses(response.data);

        // Fetch student details concurrently for each response
        const studentPromises = response.data.map((resp) =>
            axios.get(`http://localhost:5000/api/student/${resp.studentId}`, {
                headers: { Authorization: `Bearer ${token}` },
              })
          );
          console.log(studentPromises);
        // Wait for all student data to be fetched
        const studentResponses = await Promise.all(studentPromises);

        // Map the student data to a dictionary for easy access
        const studentData = studentResponses.reduce((acc, studentResp) => {
          acc[studentResp.data._id] = studentResp.data.username;
          return acc;
        }, {});

        setStudents(studentData);
      } catch (error) {
        setError("Error fetching responses or student data: " + (error.response?.data?.message || error.message));
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>All Test Responses</h2>

      {/* Loading state */}
      {loading && <p>Loading responses...</p>}

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Display responses or message if no responses */}
      {responses.length > 0 ? (
        <ul>
          {responses.map((resp) => (
            <li key={resp._id}>
              <strong>Test:</strong> {resp.test.title} <br />
              <strong>Student:</strong> {students[resp.studentId] || "Unknown"} <br />
              <strong>Score:</strong> {resp.score}
            </li>
          ))}
        </ul>
      ) : (
        <p>No responses available.</p>
      )}
    </div>
  );
}

export default AllResponses;
