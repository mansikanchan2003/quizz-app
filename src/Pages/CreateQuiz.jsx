// src/Pages/CreateQuiz.jsx
import React, { useState } from "react";
import { db, auth } from "../Firebase/firebase-config";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const CreateQuiz = () => {
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const navigate = useNavigate();

  const handleNextQuestion = (e) => {
    e.preventDefault();
    if (!currentQuestion || options.includes("")) {
      alert("Please fill in all fields.");
      return;
    }

    setQuestions([
      ...questions,
      {
        question: currentQuestion,
        options,
        answer: options[correctIndex],
      },
    ]);

    setCurrentQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
  };

  const handleCreateQuiz = async (e) => {
    e.preventDefault();

    // Add last question if it's not empty
    if (currentQuestion && !options.includes("")) {
      questions.push({
        question: currentQuestion,
        options,
        answer: options[correctIndex],
      });
    }

    if (questions.length === 0) {
      alert("Please add at least one question.");
      return;
    }

    try {
      await addDoc(collection(db, "quizzes"), {
        title,
        createdBy: auth.currentUser?.uid || "anonymous",
        questions,
      });
      alert("Quiz created!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error creating quiz.");
    }
  };

  return (
    <div className="form-container">
      <h2>Create Quiz</h2>
      <form>
        <input
          type="text"
          placeholder="Quiz Title"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Question"
          required
          value={currentQuestion}
          onChange={(e) => setCurrentQuestion(e.target.value)}
        />
        {options.map((opt, idx) => (
          <input
            key={idx}
            type="text"
            placeholder={`Option ${idx + 1}`}
            required
            value={opt}
            onChange={(e) => {
              const newOptions = [...options];
              newOptions[idx] = e.target.value;
              setOptions(newOptions);
            }}
          />
        ))}
        <select
          value={correctIndex}
          onChange={(e) => setCorrectIndex(Number(e.target.value))}
        >
          {options.map((_, idx) => (
            <option key={idx} value={idx}>
              Correct: Option {idx + 1}
            </option>
          ))}
        </select>
        <button onClick={handleNextQuestion}>Next Question</button>
        <button onClick={handleCreateQuiz} type="submit">
          Create Quiz
        </button>
      </form>
    </div>
  );
};

export default CreateQuiz;