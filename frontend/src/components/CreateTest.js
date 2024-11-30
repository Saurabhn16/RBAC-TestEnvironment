import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function CreateTest() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", ""], answer: "" }]);
  const navigate = useNavigate(); // To navigate to the menu

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://rbac-testenvironment.onrender.com/api/teacher/create-test",
        { title, questions },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Test created successfully");
    } catch (err) {
      console.error(err);
    }
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: "", options: ["", "", ""], answer: "" }]);
  };

  const goToMenu = () => {
    navigate("/teacher"); // Navigate to the Teacher Dashboard
  };

  return (
    <div style={styles.container}>
      <button onClick={goToMenu} style={styles.menuButton}>
        Go to Menu
      </button>
      <h2 style={styles.header}>Create Test</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Test Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />
        {questions.map((q, index) => (
          <div key={index} style={styles.questionContainer}>
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].question = e.target.value;
                setQuestions(newQuestions);
              }}
              style={styles.input}
            />
            {q.options.map((option, i) => (
              <input
                key={i}
                type="text"
                placeholder={`Option ${i + 1}`}
                value={option}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].options[i] = e.target.value;
                  setQuestions(newQuestions);
                }}
                style={styles.input}
              />
            ))}
            <input
              type="text"
              placeholder="Correct Answer"
              value={q.answer}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].answer = e.target.value;
                setQuestions(newQuestions);
              }}
              style={styles.input}
            />
          </div>
        ))}
        <div style={styles.buttonsContainer}>
          <button type="button" onClick={addQuestion} style={styles.addButton}>
            Add Question
          </button>
          <button type="submit" style={styles.submitButton}>
            Create Test
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  container: {
    padding: "40px",
    maxWidth: "800px",
    margin: "auto",
    backgroundColor: "#f4f7fc",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
  },
  menuButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    marginBottom: "20px",
    transition: "background-color 0.3s",
  },
  header: {
    color: "#007bff",
    fontSize: "30px",
    fontWeight: "600",
    marginBottom: "30px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
  },
  input: {
    width: "100%",
    maxWidth: "500px",
    padding: "10px",
    marginBottom: "12px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    fontSize: "16px",
    outline: "none",
    transition: "border-color 0.3s",
  },
  inputFocus: {
    borderColor: "#007bff",
  },
  questionContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "10px",
  },
  buttonsContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "20px",
  },
  addButton: {
    padding: "10px 20px",
    backgroundColor: "#28a745",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
  submitButton: {
    padding: "12px 25px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "16px",
    transition: "background-color 0.3s",
  },
};

export default CreateTest;
