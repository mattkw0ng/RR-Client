import React, { useEffect, useState } from 'react';
import API_URL from '../../config';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';
import { format, isSameDay, parseISO } from 'date-fns';
import { EVENTS, USER } from '../../data/example';

const UserProfile = () => {

    const [user, setUser] = useState(USER);
    const [events, setEvents] = useState(EVENTS);

    const getUser = async () => {
        axios.get(API_URL + '/api/auth/user', { withCredentials: true })
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

    function formatEventDates(startDate, endDate) {
        const start = parseISO(startDate);
        const end = parseISO(endDate);

        // Format for single time range if both dates are on the same day
        if (isSameDay(start, end)) {
            return `${format(start, 'eee, MMM do h:mmaaa')}-${format(end, 'h:mmaaa')}`;
        }

        // Format separately if the dates are on different days
        return `${format(start, 'eee, MMM do h:mmaaa')} - ${format(end, 'eee, MMM do h:mmaaa')}`;
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
            <h1>Welcome, {user.displayName}</h1><a href={API_URL + "/api/logout"}>Logout</a>
            <p>Email: {user.emails[0].value}</p>

            <div>
                <h5>Your Upcoming Events</h5>
                <hr />
                {events ? (
                    <div className='user-events'>
                        <ListGroup>
                            {events['pending'].map(event => (
                                <ListGroupItem key={event.id} className='p-3'>
                                    <h5>{event.summary}</h5><small>status: pending</small><br />
                                    <hr />
                                    <p>{formatEventDates(event.start.dateTime, event.end.dateTime)}</p>
                                    <p>description: {event.description}</p>
                                    
                                    <Button onClick={() => console.log(event.id)}>Edit / Cancel</Button>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                        <hr />
                        <ListGroup>
                            {events['approved'].map(event => (
                                <ListGroupItem key={event.id}>
                                    <h5>{event.summary}</h5><small>status: pending</small><br />
                                    <hr />
                                    <p>{formatEventDates(event.start.dateTime, event.end.dateTime)}</p>
                                    <p>description: {event.description}</p>
                                    
                                    <Button onClick={() => console.log(event.id)}>Edit / Cancel</Button>
                                </ListGroupItem>
                            ))}
                        </ListGroup>
                    </div>
                ) : (
                    <p>No upcoming events found.</p>
                )}
            </div>
        </div>
    );
};

export default UserProfile;
