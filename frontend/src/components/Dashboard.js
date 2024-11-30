import React, { useState, useEffect } from "react";
import axios from "axios";

const Dashboard = ({ userRole }) => {
  const [tests, setTests] = useState([]);
  const [testName, setTestName] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", "", ""], answer: "" }]);
  const [selectedTest, setSelectedTest] = useState(null);
  const [responses, setResponses] = useState([]);
  const [message, setMessage] = useState("");

  // Fetch available tests
  useEffect(() => {
    const fetchTests = async () => {
      try {
        const response = await axios.get("https://rbac-testenvironment.onrender.com/api/tests");
        setTests(response.data);
      } catch (error) {
        console.error("Error fetching tests", error);
      }
    };
    fetchTests();
  }, []);

  // Create a new test (Teacher)
  const createTest = async () => {
    try {
      await axios.post("https://rbac-testenvironment.onrender.com/api/tests", { testName, questions });
      setMessage("Test created successfully!");
    } catch (error) {
      setMessage("Error creating test.");
      console.error(error);
    }
  };

  // Submit a test response (Student)
  const submitResponse = async (testId, response) => {
    try {
      await axios.post(`https://rbac-testenvironment.onrender.com/api/tests/${testId}/submit`, { response });
      setMessage("Test submitted successfully!");
    } catch (error) {
      setMessage("Error submitting test.");
      console.error(error);
    }
  };

  // Fetch responses (Teacher or Student)
  const fetchResponses = async (testId) => {
    try {
      const response = await axios.get(`https://rbac-testenvironment.onrender.com/api/tests/${testId}/responses`);
      setResponses(response.data);
    } catch (error) {
      console.error("Error fetching responses", error);
    }
  };

  return (
    <div>
      <h1>{userRole === "teacher" ? "Teacher Dashboard" : "Student Dashboard"}</h1>
      <p>{message}</p>

      {userRole === "teacher" && (
        <div>
          <h2>Create Test</h2>
          <input
            type="text"
            placeholder="Test Name"
            value={testName}
            onChange={(e) => setTestName(e.target.value)}
          />
          {questions.map((q, idx) => (
            <div key={idx}>
              <input
                type="text"
                placeholder="Question"
                value={q.question}
                onChange={(e) =>
                  setQuestions((prev) => {
                    const updated = [...prev];
                    updated[idx].question = e.target.value;
                    return updated;
                  })
                }
              />
              {q.options.map((opt, optIdx) => (
                <input
                  key={optIdx}
                  type="text"
                  placeholder={`Option ${optIdx + 1}`}
                  value={opt}
                  onChange={(e) =>
                    setQuestions((prev) => {
                      const updated = [...prev];
                      updated[idx].options[optIdx] = e.target.value;
                      return updated;
                    })
                  }
                />
              ))}
              <input
                type="text"
                placeholder="Answer"
                value={q.answer}
                onChange={(e) =>
                  setQuestions((prev) => {
                    const updated = [...prev];
                    updated[idx].answer = e.target.value;
                    return updated;
                  })
                }
              />
            </div>
          ))}
          <button onClick={() => setQuestions([...questions, { question: "", options: ["", "", "", ""], answer: "" }])}>
            Add Question
          </button>
          <button onClick={createTest}>Submit Test</button>
        </div>
      )}

      {userRole === "student" && (
        <div>
          <h2>Available Tests</h2>
          <ul>
            {tests.map((test) => (
              <li key={test._id}>
                {test.name}
                <button onClick={() => setSelectedTest(test._id)}>Take Test</button>
              </li>
            ))}
          </ul>
          {selectedTest && (
            <div>
              <h3>Test Questions</h3>
              {/* Render questions and collect student responses */}
              {/* Example for simplicity */}
              <button onClick={() => submitResponse(selectedTest, { answers: [] })}>
                Submit Test
              </button>
            </div>
          )}
        </div>
      )}

      <div>
        <h2>View Responses</h2>
        <ul>
          {tests.map((test) => (
            <li key={test._id}>
              {test.name}
              <button onClick={() => fetchResponses(test._id)}>View Responses</button>
            </li>
          ))}
        </ul>
        {responses.length > 0 && (
          <div>
            <h3>Responses</h3>
            <pre>{JSON.stringify(responses, null, 2)}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
