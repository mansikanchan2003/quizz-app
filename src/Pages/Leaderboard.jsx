import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../Firebase/firebase-config";
import "./Leaderboard.css";

const formatTime = (ms) => {
  const seconds = Math.floor(ms / 1000);
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

const Leaderboard = () => {
  const { quizId } = useParams();
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const q = query(
          collection(db, "leaderboard"),
          where("quizId", "==", quizId),
          orderBy("score", "desc"),
          orderBy("timeTaken", "asc")
        );

        const snap = await getDocs(q);
        const allScores = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        allScores.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return a.timeTaken - b.timeTaken;
        });

        setScores(allScores.slice(0, 15));
      } catch (err) {
        console.error("Failed to fetch leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }

    if (quizId) fetchLeaderboard();
  }, [quizId]);

  if (loading) return <p>Loading leaderboard...</p>;

  return (
    <div className="leaderboard-container">
      <h2>🏆 Leaderboard</h2>
      {scores.length === 0 ? (
        <p>No scores available yet.</p>
      ) : (
        <ol>
          {scores.map((s, i) => (
            <li key={s.id}>
              <strong>{i + 1}. {s.name}</strong> — {s.score} points — Time: {formatTime(s.timeTaken)}
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default Leaderboard;
