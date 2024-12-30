import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from "../config";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogin = () => {
    const returnPath = location.state?.returnPath || "/";
    const formData = location.state?.formData || null;

    // Save state in sessionStorage for preservation
    sessionStorage.setItem("returnPath", returnPath);
    if (formData) {
      sessionStorage.setItem("formData", JSON.stringify(formData));
    }

    // Redirect to Google OAuth
    window.location.href = `${API_URL}/api/auth/google?returnPath=${encodeURIComponent(returnPath)}`;
  };

  useEffect(() => {
    // Check if user is already logged in
    const fetchUser = async () => {
      try {
        const response = await fetch(`${API_URL}/api/auth/user`, { credentials: "include" });
        if (response.ok) {
          const user = await response.json();
          setUser(user);

          // Retrieve preserved state if available
          const returnPath = sessionStorage.getItem("returnPath") || "/";
          const formData = JSON.parse(sessionStorage.getItem("formData") || "{}");

          // Clear sessionStorage
          sessionStorage.removeItem("returnPath");
          sessionStorage.removeItem("formData");

          // Redirect to the intended page
          navigate(returnPath, { state: formData });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, [setUser, navigate]);

  return (
    <div>
      <h1>Login</h1>
      <button onClick={handleLogin}>Login with Google</button>
      <small>If you already have an account, log in to continue.</small>
    </div>
  );
};

export default Login;
