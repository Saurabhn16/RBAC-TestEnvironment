import React, { useState } from "react";
import axios from "axios";

function CreateTest() {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([{ question: "", options: ["", "", ""], answer: "" }]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/teacher/create-test",
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

  return (
    <div>
      <h2>Create Test</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Test Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        {questions.map((q, index) => (
          <div key={index}>
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => {
                const newQuestions = [...questions];
                newQuestions[index].question = e.target.value;
                setQuestions(newQuestions);
              }}
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
            />
          </div>
        ))}
        <button type="button" onClick={addQuestion}>
          Add Question
        </button>
        <button type="submit">Create Test</button>
      </form>
    </div>
  );
}

export default CreateTest;
