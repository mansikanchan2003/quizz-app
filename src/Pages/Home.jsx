import React from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './Home.css'; // optional CSS file

const Home = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  

  const handleClick = () => {
    const user = auth.currentUser;
    if (user) {
      navigate('/dashboard');
    } else {
      alert("Please log in to access the dashboard.");
    }
  };

  return (
    <div className="home-container">
      <img
        src="https://www.churchofjesuschrist.org/imgs/878e8eff69ded036b67f803c3b6fcfd4ca53121c/full/!1280%2C801/0/default"
        alt="Quiz Banner"
        className="home-banner"
      />
      <div className="start-card" onClick={handleClick}>
        <h2>🎯 Start Attempting & Creating Quizzes</h2>
        <p>Click here to explore all the fun and challenges!</p>
      </div>
    </div>
  );
};

export default Home;
