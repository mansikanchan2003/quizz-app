import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

const Navbar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe(); // Cleanup listener on unmount
  }, [auth]);

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/login');
  };

  return (
    <nav style={styles.navbar}>
      <h2 style={styles.logo}>
        <Link to="/" style={styles.link}>QuizApp</Link>
      </h2>
      <div>
        <Link to="/home" style={styles.link}>Home</Link>
        {user ? (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/create-quiz" style={styles.link}>Create Quiz</Link>
            <button onClick={handleLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

const styles = {
  navbar: {
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'linear-gradient(-45deg, #e81cff 0%, #40c9ff 100%)',
    color: 'white',
  },
  logo: {
    margin: 0,
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    margin: '0 10px',
  },
  button: {
    marginLeft: '10px',
    padding: '5px 10px',
    cursor: 'pointer',
    border: 'none',
    backgroundColor: 'white',
    color: 'black',
    borderRadius: '4px',
  },
};

export default Navbar;
