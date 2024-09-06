import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AdminPage from './components/AdminPage';
import RoomRes from './components/RoomRes'; // Assuming you have a home page
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import NavBar from './components/NavBar';

const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token; // Returns true if token exists, otherwise false
};

const App = () => {
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
      // Optionally, add any logic to refresh token or keep user authenticated
      setAuth(isAuthenticated());
      console.log(auth);
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setAuth(true)} />} />
        <Route
            path="/profile"
            element={<UserProfile />}
        />
        <Route path="/" element={<RoomRes />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
};

export default App;
