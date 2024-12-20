import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AdminPage from './components/pages/AdminPage';
import RoomRes from './components/pages/RoomRes'; // Assuming you have a home page
import Login from './components/Login';
import UserProfile from './components/pages/UserProfile';
import NavBar from './components/NavBar';
import RoomSearch from './components/pages/RoomSearch';
import AdminPortal from './components/pages/AdminPortal';

const isAuthenticated = () => {
  const token = localStorage.getItem('authToken');
  return !!token; // Returns true if token exists, otherwise false
};

const App = () => {
  const [auth, setAuth] = useState(isAuthenticated());

  useEffect(() => {
      // Optionally, add any logic to refresh token or keep user authenticated
      setAuth(isAuthenticated());
  }, []);

  return (
    <Router>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login onLogin={() => setAuth(true)} auth={auth} />} />
        <Route
            path="/profile"
            element={<UserProfile />}
        />
        <Route path="search" element={<RoomSearch />} />
        <Route path="/" element={<RoomRes />} />
        <Route path="/admin" element={<AdminPortal />} />
      </Routes>
    </Router>
  );
};

export default App;
