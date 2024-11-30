import React, { useState, useEffect } from "react"; 
import axios from "axios";
import { useNavigate } from "react-router-dom";  // Import useNavigate

function AllResponses() {
  const [responses, setResponses] = useState([]);
  const [students, setStudents] = useState({});
  const [loadingResponses, setLoadingResponses] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Initialize the navigate function

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          setError("No authorization token found. Please log in.");
          setLoadingResponses(false);
          return;
        }

        // Fetch responses
        const { data: responseData } = await axios.get(
          "http://localhost:5000/api/teacher/test-responses",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        setResponses(responseData);

        if (responseData.length > 0) {
          setLoadingStudents(true);

          // Fetch student details concurrently
          const studentPromises = responseData.map((resp) =>
            axios.get(`http://localhost:5000/api/student/${resp.student._id}`, {
              headers: { Authorization: `Bearer ${token}` },
            })
          );

          const studentResponses = await Promise.allSettled(studentPromises);

          const studentData = studentResponses.reduce((acc, result, index) => {
            const studentId = responseData[index].student._id;
            if (result.status === "fulfilled") {
              acc[studentId] = result.value.data.username;
            } else {
              acc[studentId] = "Error fetching student name";
            }
            return acc;
          }, {});

          setStudents(studentData);
        }
      } catch (err) {
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoadingResponses(false);
        setLoadingStudents(false);
      }
    };

    fetchResponses();
  }, []);

  return (
    <div style={{ padding: "20px", maxWidth: "1000px", margin: "auto" }}>
      <h2>All Test Responses</h2>
      {loadingResponses && <p>Loading responses...</p>}
      {loadingStudents && <p>Loading student details...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      
      {/* Button to navigate to the teacher's dashboard */}
      <button
        onClick={() => navigate("/teacher")}  // Navigate back to teacher's dashboard
        style={{
          margin: "20px 0",
          padding: "10px 20px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Back to Menu
      </button>

      {!loadingResponses && responses.length > 0 ? (
        <table style={{ width: "100%", borderCollapse: "collapse", marginTop: "20px" }}>
          <thead style={{ backgroundColor: "#f4f4f9" }}>
            <tr>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Test</th>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Student</th>
              <th style={{ padding: "10px", textAlign: "left", borderBottom: "1px solid #ddd" }}>Score</th>
            </tr>
          </thead>
          <tbody>
            {responses.map((resp) => (
              <tr key={resp._id} style={{ borderBottom: "1px solid #ddd" }}>
                <td style={{ padding: "8px" }}>{resp.test?.title || "Unknown"}</td>
                <td style={{ padding: "8px" }}>{students[resp.student._id] || "Unknown/Fetching error"}</td>
                <td style={{ padding: "8px" }}>{resp.score || "Not Available"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        !loadingResponses && <p>No responses available.</p>
      )}
    </div>
  );
}

export default AllResponses;
