import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function AttemptTest() {
  const { id } = useParams();
  const [test, setTest] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTest = async () => {
      try {
        const token = localStorage.getItem("authToken");

        if (!token) {
          alert("You must be logged in to attempt the test.");
          navigate("/login"); // Redirect to login if token is not present
          return;
        }
        const response = await axios.get(`http://localhost:5000/api/student/tests/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTest(response.data);
        setAnswers(new Array(response.data.questions.length).fill("")); // Initialize answers with empty strings
      } catch (err) {
        console.error("Error fetching test data:", err.response ? err.response.data : err.message);
        setError("Failed to load test. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchTest();
  }, [id, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if all questions are answered
    if (answers.includes("")) {
      alert("Please answer all questions before submitting.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        alert("You must be logged in to submit the test.");
        navigate("/login"); // Redirect to login if token is missing
        return;
      }

      const response = await axios.post(
        `http://localhost:5000/api/student/submit/${id}`,
        { answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        alert("Test submitted successfully!");
        navigate("/student"); // Redirect to the student page after submission
      }
    } catch (err) {
      console.error("Error submitting test:", err.response ? err.response.data : err.message);
      alert("Submission failed. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  if (!test) return <div>Test not found.</div>;

  return (
    <div>
      <h2>{test.title}</h2>
      <form onSubmit={handleSubmit}>
        {test.questions.map((q, index) => (
          <div key={index}>
            <p>{q.question}</p>
            {q.options.map((option, i) => (
              <label key={i}>
                <input
                  type="radio"
                  name={`question-${index}`}
                  value={option}
                  checked={answers[index] === option} // Ensure the selected option is checked
                  onChange={() => {
                    setAnswers(prevAnswers => {
                      const newAnswers = [...prevAnswers];
                      newAnswers[index] = option;
                      return newAnswers;
                    });
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        ))}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default AttemptTest;
