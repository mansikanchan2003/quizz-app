// src/Firebase/firebase-config.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
 apiKey: "AIzaSyDG1btCyph8URD9Ar-m6fdZKifAqCmXGvk",
  authDomain: "quizz-88f70.firebaseapp.com",
  projectId: "quizz-88f70",
  storageBucket: "quizz-88f70.firebasestorage.app",
  messagingSenderId: "352999704792",
  appId: "1:352999704792:web:a9616746cce5ea106d2fad",
  measurementId: "G-H6F8PWFVLM"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

export const auth = getAuth(app);          // Only declare once
const db = getFirestore(app);
export { db };

export default app;
