import React, { useEffect, useState } from 'react';
import API_URL from '../config';
import axios from 'axios';

const UserProfile = () => {
    const [user, setUser] = useState(null);
    const [events, setEvents] = useState(null);

    const getUser = async () => {
        axios.get(API_URL + '/auth/user', { withCredentials: true })
            .then((response) => {
                if (response.data.user) {
                    console.log("Successfully loaded User's Profile")
                    setUser(response.data.user);
                } else {
                    console.error('Not authenticated');
                }
            })
            .catch((err) => console.error(err));
    }

    const getUserEvents = async () => {
        axios.get(API_URL + '/api/userEvents', { withCredentials: true })
            .then((res) => {
                console.log("Successfully loaded User's Events")
                setEvents(res.data); // Assuming you have a state variable for events
            })
            .catch((err) => {
                console.error('Failed to load events', err);
            });
    }

    useEffect(() => {
        getUser();
        getUserEvents();
    }, []);

    if (!user) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>Welcome, {user.displayName}</h1>
            <p>Email: {user.emails[0].value}</p>
            <a href={API_URL + "/logout"}>Logout</a>
            <div>
                <h2>Your Upcoming Events</h2>
                {events ? (
                    <ul>
                        {events.map(event => (
                            <li key={event.id}>
                                <h3>{event.summary}</h3>
                                <p>Date: {new Date(event.start.dateTime).toLocaleString()}</p>
                                <p>Status: {event.status === 'approved' ? 'Accepted' : 'Pending Approval'}</p>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No upcoming events found.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
