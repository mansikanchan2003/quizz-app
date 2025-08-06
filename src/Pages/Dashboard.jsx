// src/Pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onUserStateChanged } from "../Firebase/auth";
import { db } from "../Firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";
import "./Dash.css";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [quizzes, setQuizzes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onUserStateChanged((user) => {
      if (user) {
        setUsername(user.displayName || "Anonymous");
        fetchQuizzes(); // Fetch quizzes on login
      } else {
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchQuizzes = async () => {
    const quizSnapshot = await getDocs(collection(db, "quizzes"));
    const quizData = quizSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setQuizzes(quizData);
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h2>Welcome, {username}</h2>
      </div>
      <div className="quiz-cards">
        {quizzes.map((quiz) => (
          <Link
            to={`/quiz/${quiz.id}`}
            key={quiz.id}
            className="quiz-card"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <img
              src="https://cdn-icons-png.flaticon.com/512/5694/5694749.png"
              alt="Quiz Icon"
              className="quiz-logo"
            />
            <h3>Attempt {quiz.title}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
