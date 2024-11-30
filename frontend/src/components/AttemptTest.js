import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function StudentDashboard() {
  const [tests, setTests] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTestsAndResponses = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          navigate("/login");
          return;
        }

        // Fetch tests data
        const testsResponse = await axios.get(
          `http://localhost:5000/api/student/tests`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setTests(testsResponse.data);

        // Fetch responses data
        const responsesResponse = await axios.get(
          `http://localhost:5000/api/student/responses`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setResponses(responsesResponse.data);
      } catch (err) {
        if (err.response) {
          if (err.response.status === 401) {
            setError("Unauthorized. Please log in again.");
            navigate("/login");
          } else {
            setError("Failed to fetch data. Please try again later.");
          }
        } else {
          setError("Network error. Please check your connection.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTestsAndResponses();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  // Helper function to get the maximum score for a test
  const getMaxScoreForTest = (testId) => {
    const matchingResponses = responses.filter(
      (response) => response.test && response.test._id === testId
    );
    if (matchingResponses.length > 0) {
      return Math.max(...matchingResponses.map((response) => response.score));
    }
    return "Not Attempted";
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>Student Dashboard</h2>

      {loading && <p>Loading data...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && !error && tests.length === 0 && (
        <p>No tests available to attempt.</p>
      )}
      {!loading && !error && tests.length > 0 && (
        <div>
          <h3>Tests</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Test Title
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Max Score
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test._id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {test.title}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {getMaxScoreForTest(test._id)}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    <Link
                      to={`/student/attempt-test/${test._id}`}
                      style={{ textDecoration: "none", color: "blue" }}
                    >
                      Attempt Test
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!loading && !error && responses.length === 0 && (
        <p>No responses available.</p>
      )}
      {!loading && !error && responses.length > 0 && (
        <div>
          <h3>Responses</h3>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Test Title
                </th>
                <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                  Response
                </th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response._id}>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {response.test?.title || "Unknown Test"}
                  </td>
                  <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                    {response.score !== undefined
                      ? `Score: ${response.score}`
                      : "No response yet"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <button
        onClick={handleLogout}
        style={{
          marginTop: "20px",
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

export default StudentDashboard;