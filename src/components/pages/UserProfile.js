import React, { useEffect, useState } from 'react';
import API_URL from '../../config';
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
                console.log(res.data);
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
        return <div className='p-5'>Loading...</div>;
    }

    return (
        <div className='p-5'>
            <h1>Welcome, {user.displayName}</h1>
            <p>Email: {user.emails[0].value}</p>
            <a href={API_URL + "/logout"}>Logout</a>
            <div>
                <h5>Your Upcoming Events</h5>
                {events ? (
                    <div className='user-events'>
                        <ul>
                            {events['pending'].map(event => (
                                <li key={event.id}>
                                    <h3>{event.summary}</h3>
                                    <p>Date: {new Date(event.start.dateTime).toLocaleString()}</p>
                                    <p>Status: Pending Approval</p>
                                </li>
                            ))}
                        </ul>
                        <ul>
                            {events['approved'].map(event => (
                                <li key={event.id}>
                                    <h3>{event.summary}</h3>
                                    <p>Date: {new Date(event.start.dateTime).toLocaleString()}</p>
                                    <p>Status: Approved</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                ) : (
                    <p>No upcoming events found.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
