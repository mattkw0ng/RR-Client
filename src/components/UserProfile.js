import React, { useEffect, useState } from 'react';
import API_URL from '../config';

const UserProfile = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(API_URL + '/auth/user', {
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
            <a href={API_URL + "/logout"}>Logout</a>
        </div>
    );
};

export default UserProfile;
