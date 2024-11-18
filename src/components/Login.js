import React from 'react';
import API_URL from '../config';

const Login = ({auth}) => {
    const handleLogin = () => {
        window.location.href = API_URL+'/api/auth/google'; // Redirect to Google OAuth
    };

    return (
        <div>
            <h1>Login</h1>
            <button onClick={handleLogin}>Login with Google</button>
            <small>{auth}</small>
        </div>
    );
};

export default Login;
