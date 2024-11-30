import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./student.css";
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
    <div className="dashboard-container">
      <h2>Student Dashboard</h2>

      {loading && <p>Loading data...</p>}
      {error && <p className="error-message">{error}</p>}

      {!loading && !error && tests.length === 0 && (
        <p>No tests available to attempt.</p>
      )}
      {!loading && !error && tests.length > 0 && (
        <div>
          <h3>Tests</h3>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Test Title</th>
                <th>Max Score</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test._id}>
                  <td>{test.title}</td>
                  <td>{getMaxScoreForTest(test._id)}</td>
                  <td>
                    <Link
                      to={`/student/attempt-test/${test._id}`}
                      className="attempt-button"
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
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Test Title</th>
                <th>Response</th>
              </tr>
            </thead>
            <tbody>
              {responses.map((response) => (
                <tr key={response._id}>
                  <td>{response.test?.title || "Unknown Test"}</td>
                  <td>
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

      <button className="logout-button" onClick={handleLogout}>
        Logout
      </button>
    </div>
  );
}

export default StudentDashboard;

