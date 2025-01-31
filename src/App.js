import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
// import AdminPage from './components/pages/AdminPage';
import { AuthProvider } from './context/AuthContext';

import RoomRes from './components/pages/RoomRes'; // Assuming you have a home page
import Login from './components/Login';
import UserProfile from './components/pages/UserProfile';
import NavBar from './components/NavBar';
import RoomSearch from './components/pages/RoomSearch';
import AdminPortal from './components/pages/AdminPortal';
import ProtectedRoute from './context/ProtectedRoute';
import HomePage from './components/pages/HomePage';

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
    <AuthProvider children={
      <Router>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/profile"
            element={<UserProfile />}
          />
          <Route path="/search-rooms" element={<RoomSearch auth={auth} />} />
          <Route path="/room-reservation-form" element={<RoomRes auth={auth} />} />
          <Route path="/" element={<HomePage />} />
          <Route element={<ProtectedRoute requiredRoles={['admin', 'superadmin']} />}>
            <Route path='/admin' element={<AdminPortal />} />
          </Route>
        </Routes>
      </Router>

    }>
    </AuthProvider>
  );
};

export default App;
