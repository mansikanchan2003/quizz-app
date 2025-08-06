import React, { useEffect, useRef, useState } from "react";
import "./Quiz.css";
import { useParams, Link, useNavigate } from "react-router-dom";
import { db } from "../Firebase/firebase-config";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import Certificate from "../Pages/Certificate";

const Quiz = () => {
  const { quizId } = useParams();
  const [quizData, setQuizData] = useState(null);
  const [index, setIndex] = useState(0);
  const [lock, setLock] = useState(false);
  const [score, setScore] = useState(0);
  const [result, setResult] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);

  const Option1 = useRef(null);
  const Option2 = useRef(null);
  const Option3 = useRef(null);
  const Option4 = useRef(null);
  const option_array = [Option1, Option2, Option3, Option4];

  const startTime = useRef(Date.now());

  // Fetch user once available
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      if (u) {
        setUser(u);
      } else {
        navigate("/home");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  useEffect(() => {
    if (!quizId) return;

    const fetchQuiz = async () => {
      try {
        const docRef = doc(db, "quizzes", quizId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setQuizData(docSnap.data());
        } else {
          alert("Quiz not found!");
        }
      } catch (err) {
        console.error("Error fetching quiz:", err);
        alert("Failed to fetch quiz.");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [quizId]);

  const checkAns = (e, ansIdx) => {
    if (!lock && quizData) {
      const currentQ = quizData.questions[index];
      const correctIdx = currentQ.options.indexOf(currentQ.answer);
      if (ansIdx === correctIdx) {
        e.target.classList.add("correct");
        setScore((prev) => prev + 1);
      } else {
        e.target.classList.add("wrong");
        option_array[correctIdx].current.classList.add("correct");
      }
      setLock(true);
    }
  };

  const saveResultToLeaderboard = async () => {
    if (!user) return;

    const timeTaken = Date.now() - startTime.current;
    const docId = `${quizId}_${user.uid}`;
    const leaderboardRef = doc(db, "leaderboard", docId);

    const existingEntry = await getDoc(leaderboardRef);

    if (!existingEntry.exists()) {
      // First time attempt
      await setDoc(leaderboardRef, {
        uid: user.uid,
        name: user.displayName || "Anonymous",
        score,
        quizId,
        timeTaken,
        timestamp: new Date(),
      });
    } else {
      // Only update if current score is better or same score in less time
      const data = existingEntry.data();
      const isBetter =
        score > data.score || (score === data.score && timeTaken < data.timeTaken);

      if (isBetter) {
        await setDoc(leaderboardRef, {
          ...data,
          score,
          timeTaken,
          timestamp: new Date(),
        });
      }
    }
  };

  const next = async () => {
    if (lock) {
      if (index === quizData.questions.length - 1) {
        setResult(true);
        await saveResultToLeaderboard();
        return;
      }
      setIndex((prev) => prev + 1);
      setLock(false);
      option_array.forEach((opt) =>
        opt.current.classList.remove("correct", "wrong")
      );
    }
  };

  const reset = () => {
    setIndex(0);
    setScore(0);
    setLock(false);
    setResult(false);
    startTime.current = Date.now();
    option_array.forEach((opt) =>
      opt.current.classList.remove("correct", "wrong")
    );
  };

  if (loading) return <div>Loading quiz...</div>;
  if (!quizData) return <div>Quiz not found.</div>;

  const currentQuestion = quizData.questions[index];

  return (
    <div className="container">
      <h1>{quizData.title}</h1>
      <hr />
      {!result ? (
        <>
          <h2>
            {index + 1}. {currentQuestion.question}
          </h2>
          <ul>
            {currentQuestion.options.map((opt, idx) => (
              <li
                key={idx}
                ref={option_array[idx]}
                onClick={(e) => checkAns(e, idx)}
              >
                {opt}
              </li>
            ))}
          </ul>
          <button onClick={next}>Next</button>
          <div className="index">
            {index + 1} of {quizData.questions.length} Questions
          </div>
        </>
      ) : (
        <>
          <h2>
            You Scored {score} out of {quizData.questions.length}
          </h2>
          <Link to={`/leaderboard/${quizId}`} className="leaderboard-link">
            View Leaderboard
          </Link>
          <button onClick={reset}>Reset</button>
          <Certificate
            name={user?.email}
            score={score}
            total={quizData.questions.length}
            quizTitle={quizData.title}
          />
        </>
      )}
    </div>
  );
};

export default Quiz;
