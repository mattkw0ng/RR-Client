import React, { createContext, useContext, useState, useEffect } from "react";
import API_URL from "../config";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fetch user data on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/user`, { withCredentials: true });;
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null)
      }
    };

    fetchUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
