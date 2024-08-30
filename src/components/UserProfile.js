import React, { useEffect, useState } from 'react';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch('http://localhost:5000/auth/user', {
            credentials: 'include',
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.user) {
                setUser(data.user);
            } else {
                console.error('Not authenticated');
            }
        })
        .catch((err) => console.error(err));
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Welcome, {user.displayName}</h1>
            <p>Email: {user.emails[0].value}</p>
            <a href="http://localhost:5000/logout">Logout</a>
        </div>
    );
};

export default UserProfile;
