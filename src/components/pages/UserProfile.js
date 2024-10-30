import React, { useEffect, useState } from 'react';
import API_URL from '../../config';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';

const UserProfile = () => {

    const example = {
        id: '111710622873388516085',
        displayName: 'Matthew Kwong',
        name: { familyName: 'Kwong', givenName: 'Matthew' },
        emails: [ {'value':'mattkwong52@gmail.com'} ],
        photos: [ [Object] ],
        provider: 'google',
        _raw: '{\n' +
          '  "sub": "111710622873388516085",\n' +
          '  "name": "Matthew Kwong",\n' +
          '  "given_name": "Matthew",\n' +
          '  "family_name": "Kwong",\n' +
          '  "picture": "https://lh3.googleusercontent.com/a/ACg8ocLXjTQG-YRqP_YOmuaVtH74jSsi_P4pkB93LJ05v50YIm4YYA\\u003ds96-c",\n' +
          '  "email": "fudgenuggetgames@gmail.com",\n' +
          '  "email_verified": true\n' +
          '}',
        _json: {
          sub: '111710622873388516085',
          name: 'Matthew Kwong',
          given_name: 'Matthew',
          family_name: 'Kwong',
          picture: 'https://lh3.googleusercontent.com/a/ACg8ocLXjTQG-YRqP_YOmuaVtH74jSsi_P4pkB93LJ05v50YIm4YYA=s96-c',
          email: 'fudgenuggetgames@gmail.com',
          email_verified: true
        }
      }
    const [user, setUser] = useState(example);
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
            <h1>Welcome, {user.displayName}</h1><a href={API_URL + "/logout"}>Logout</a>
            <p>Email: {user.emails[0].value}</p>
            
            <div>
                <h5>Your Upcoming Events</h5>
                {events ? (
                    <div className='user-events'>
                        <h2>Pending Events</h2>
                        <ListGroup>
                            {events['pending'].map(event => (
                            <ListGroupItem key={event.id}>
                                <h5>{event.summary}</h5>
                                <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}</p>
                                <p>{event.description}</p>
                                <Button onClick={() => console.log(event.id)}>Edit / Cancel</Button>
                            </ListGroupItem>
                            ))}
                        </ListGroup>
                        <ListGroup>
                            {events['approved'].map(event => (
                            <ListGroupItem key={event.id}>
                                <h5>{event.summary}</h5>
                                <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}</p>
                                <p>{event.description}</p>
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
