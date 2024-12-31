import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import API_URL from "../config";
import "./Login.css"; // Import custom styles


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
        <div className="login-container d-flex flex-column justify-content-center align-items-center">
            <div className="login-card card shadow p-4">
                <h1 className="text-center mb-4">Welcome</h1>
                <img
                    src='/signin-assets/light_sign_in.png'
                    alt="Google Logo"
                    className="google-login-button mx-auto mb-3"
                    width="200px"
                    onClick={handleLogin}
                />

                <p className="text-center text-muted">
                    Log in to access your account and manage reservations.
                </p>
            </div>
        </div>
    );
};

export default Login;
