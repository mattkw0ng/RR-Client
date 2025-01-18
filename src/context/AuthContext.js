import React, { createContext, useContext, useState, useEffect } from "react";
import API_URL from "../config";
import axios from "axios";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on initial load
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/auth/user`, { withCredentials: true });;
        // console.log("AuthContext response", response.data.user)
        setUser(response.data.data, () => {
          console.log('Loading finished (from callback)');
          setLoading(false);
        });
      } catch (error) {
        console.error("Error fetching user data:", error);
        setUser(null)
      }
    };

    fetchUser();
  }, []);

  useEffect(() => {
    console.log("user data updated: ", user);
  }, [user]);
  useEffect(() => {
    console.log("loading status updated: ", loading);
  }, [loading]);

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
