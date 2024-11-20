import React, { useEffect, useState } from 'react';
import API_URL from '../../config';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem, Badge, Container } from 'reactstrap';
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

    // Display Events
    const EventList = ({ list, status}) => {
        return (
        <ListGroup>
            {list.map(event => (
                <ListGroupItem key={event.id} className='p-3'>
                    {/* Title & Status & Other Badges */}
                    <div className='d-flex'>
                        <h5 className='mb-0'>{event.summary}</h5>
                        <Badge pill className='ms-2' color={status === 'pending' ? 'secondary':'primary'} >{status}</Badge><br />
                        {event.recurrence || event.recurringEventId ? (
                            <Badge bg="info" pill className="ms-2" color='success' style={{ fontSize: '0.6em' }}>
                                Recurring
                            </Badge>
                        ) : null}
                    </div>

                    <hr />
                    <p>
                        {formatEventDates(event.start.dateTime, event.end.dateTime)}
                        <br />
                        Description: {event.description}
                    </p>

                    <Button outline size="sm" onClick={() => console.log(event.id)} >Edit / Cancel</Button>
                </ListGroupItem>
            ))}
        </ListGroup>
    )};

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
                        <EventList list={events['pending']} status={'pending'} />

                        <hr />

                        {/* Approved Events */}
                        <EventList list={events['approved']} status={'approved'} />
                    </div>
                ) : (
                    <p>No upcoming events found.</p>
                )}
            </div>
        </Container>
    );
};

export default UserProfile;
