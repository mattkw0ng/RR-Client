import React, { useEffect, useState } from 'react';
import API_URL from '../../config';
import axios from 'axios';
import { Container, ListGroup, Button, Badge, Modal, ModalHeader, ModalBody } from 'reactstrap';

import { useAuth } from '../../context/AuthContext';

import StandardEvent from '../events/StandardEvent';
import EditEventForm from '../edit/EditEventForm';
import ModifiedEvent from '../events/ModifiedEvent';

const UserProfile = () => {
    const { user, loading } = useAuth();
    const [events, setEvents] = useState();

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
        if (!user) return; // Guard clause to prevent premature access
        console.log("User loaded:", user);
    }, [user]);

    useEffect(() => {
        getUserEvents();
    }, []);

    if (loading) {
        return <div className='p-5'>Loading...</div>;
    }

    const approvedBadge = <Badge pill className='ms-2' color={'primary'} style={{ fontSize: '0.6em' }}>approved</Badge>
    const pendingBadge = <Badge pill className='ms-2' color={'secondary'} style={{ fontSize: '0.6em' }} >pending</Badge>
    const needsActionBadge = <Badge pill className='ms-2' color={'danger'} style={{ fontSize: '0.6em' }} >needs action</Badge>

    const onSubmitFunction = (closeModal) => {
        closeModal(false);
        setEvents(null);
        getUserEvents();
    }

    const EditorModal = ({ event, pending }) => {

        const [modal, setModal] = useState(false);

        const toggle = () => setModal(!modal);

        return (
            <div>
                <Button size='sm' color="secondary" onClick={toggle}>
                    Edit
                </Button>
                <Modal isOpen={modal} toggle={toggle} size='xl'>
                    <ModalHeader toggle={toggle}><span className='text-secondary'> {event.summary} </span></ModalHeader>
                    <ModalBody className='px-3'>

                        <EditEventForm event={event} pending={pending} onSubmit={onSubmitFunction} setModal={setModal} />
                    </ModalBody>

                </Modal>
            </div>
        );
    }

    const handleCancelEvent = (e, event) => {
        e.preventDefault();
        const confirmation = window.confirm(`Cancel ${event.summary}?`);
        if (confirmation) {
            console.log("Deleting event");
        }
    }

    const handleAcceptChanges = (e, event) => {
        e.preventDefault();
        console.log("Accepting Changes", event.id);
        axios.post(API_URL + '/api/acceptProposedChanges', { eventId: event.id }, { withCredentials: true })
            .then(response => {
                alert('Event accepted successfully:', response.data);
                getUserEvents();
            })
            .catch(error => {
                console.error('Error accepting changes:', error.response ? error.response.data : error.message);
            });
    }

    const DisplayEvents = ({displayEvents, isPending}) => {
        console.log("Rendering:", displayEvents);
        useEffect(() => {
            console.log("UseEffect Rendering:", displayEvents);
        }, [displayEvents])

        return (
            <ListGroup>
                {displayEvents?.map(event => (
                    <StandardEvent
                        key={event.id}
                        event={event}
                        button={<div className='d-flex gap-2'><EditorModal event={event} pending={isPending} /> <Button color='danger' size='sm' onClick={(e) => handleCancelEvent(e, event)}>Cancel Event</Button></div>}
                        badge={isPending ? pendingBadge : approvedBadge}
                        pending={isPending}
                    />
                ))}
            </ListGroup>)
    }

    return (
        <Container className='my-4'>
            <div className='d-flex justify-content-between'>
                <h2 className='mb-0'>Welcome, {user.displayName}</h2>
                <a href={API_URL + "/api/logout"} className='btn btn-sm'>Logout</a>
            </div>

            <p>{user?.emails?.[0]?.value || "No email provided"}</p>

            <div>
                <h5>My Reservations</h5>
                <hr />
                {events ? (
                    <div className='user-events'>
                        {/* Proposed Events */}
                        <ListGroup>
                            {events['proposed']?.map(event => (
                                (<ModifiedEvent
                                    key={event.id}
                                    event={event}
                                    button={<Button color='danger' size='sm' onClick={(e) => handleAcceptChanges(e, event)}>Accept Changes</Button>}
                                    badge={needsActionBadge}
                                    pending={false}
                                />)
                            ))}
                        </ListGroup>

                        {/* Pending Events First */}
                        <DisplayEvents displayEvents={events['pending']} isPending={true} />

                        <hr />

                        {/* Approved Events */}
                        <DisplayEvents displayEvents={events['approved']} isPending={false} />
                    </div>
                ) : (
                    <p>No upcoming events found.</p>
                )}
            </div>
        </Container>
    );
};

export default UserProfile;
