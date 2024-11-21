import React, { useEffect, useState } from 'react';
import API_URL from '../../config';
import axios from 'axios';
import { ListGroup, Badge, Container } from 'reactstrap';

import { EVENTS, USER } from '../../data/example';
import StandardEvent from '../events/StandardEvent';

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

    useEffect(() => {
        getUser();
        getUserEvents();
    }, []);

    if (!user) {
        return <div className='p-5'>Loading...</div>;
    }

    const approvedBadge = <Badge pill className='ms-2' color={'primary'} style={{ fontSize: '0.6em' }}>approved</Badge>
    const pendingBadge = <Badge pill className='ms-2' color={'secondary'} style={{ fontSize: '0.6em' }} >pending</Badge>

    return (
        <Container className='my-4'>
            <div className='d-flex justify-content-between'>
                <h2 className='mb-0'>Welcome, {user.displayName}</h2>
                <a href={API_URL + "/api/logout"} className='btn btn-sm'>Logout</a>
            </div>

            <p>{user.emails[0].value}</p>

            <div>
                <h5>My Reservations</h5>
                <hr />
                {events ? (
                    <div className='user-events'>
                        {/* Pending Events First */}
                        <ListGroup>
                            {events['pending'].map(event => (
                                (<StandardEvent key={event.id} event={event} buttonText={"Edit/Cancel"} buttonHandler={console.log} badge={pendingBadge} />)
                            ))}
                        </ListGroup>

                        <hr />

                        {/* Approved Events */}
                        <ListGroup>
                            {events['approved'].map(event => (
                                (<StandardEvent key={event.id} event={event} buttonText={"Edit/Cancel"} buttonHandler={console.log} badge={approvedBadge} />)
                            ))}
                        </ListGroup>
                    </div>
                ) : (
                    <p>No upcoming events found.</p>
                )}
            </div>
        </Container>
    );
};

export default UserProfile;
