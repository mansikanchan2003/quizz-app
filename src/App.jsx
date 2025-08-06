
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";
import "./Components/Footer.css"
import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import Dashboard from "./Pages/Dashboard";
import Quiz from "./Components/Quiz";
import CreateQuiz from "./Pages/CreateQuiz";
import Certificate from "./Pages/Certificate";
import Leaderboard from "./Pages/Leaderboard";
import ProtectedRoute from "./Components/ProtectedRoute";

const App = () => {
  return (
    <div className="wrapper">
      <Router>
    <Navbar />
      <div className="main_content">
        <Routes>
        <Route path="/" element={<Quiz />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route path="/quiz/:quizId" element={<Quiz />} />
        <Route
          path="/create-quiz"
          element={
            <ProtectedRoute>
              <CreateQuiz />
            </ProtectedRoute>
          }
        />
        <Route path="/certificate" element={<Certificate />} />
        <Route path="/leaderboard/:quizId" element={<Leaderboard />} />
        <Route path="*" element={<Home />} />
      </Routes>
      </div>
      <Footer />
    </Router>
    </div>
  );
};

export default App;
