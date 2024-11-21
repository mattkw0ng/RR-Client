import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, ListGroupItem, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import API_URL from '../../config';
import { ADMINEVENTS } from '../../data/example';


import StackedTimelineDraggable from '../StackedTimelineDraggable';

const AdminPage = () => {
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState(ADMINEVENTS);

  const fetchApprovedEvents = async () => {
    try {
      const response = await axios.get(API_URL + '/api/approvedEvents', { withCredentials: true });
      setApprovedEvents(response.data);
    } catch (error) {
      console.error('Error fetching approved events:', error);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const response = await axios.get(API_URL + '/api/pendingEventsWithConflicts', { withCredentials: true });
      setPendingEvents(response.data);
    } catch (error) {
      console.error('Error fetching pending events:', error);
    }
  };

  useEffect(() => {
    fetchApprovedEvents();
    fetchPendingEvents();
  }, []);

  const handleApproveEvent = async (eventId) => {
    console.log("Approving", eventId);
    axios.post(API_URL + '/api/approveEvent', { eventId }, { withCredentials: true })
      .then(response => {
        alert('Event approved successfully:', response.data);
        fetchApprovedEvents();
        fetchPendingEvents();
        // Optionally, you could trigger a re-render or refresh the list of pending events
      })
      .catch(error => {
        console.error('Error approving event:', error.response ? error.response.data : error.message);
      });
  };

  const RecurringEventList = ({ list }) => {
    return (
      <div>
        {list.map(instance => (
          <span key={instance.id}>
            {new Date(instance.start.dateTime).toLocaleString()} - {new Date(instance.end.dateTime).toLocaleString()}
            {instance.conflicts.length === 0 ?
              null :
              <Badge bg="info" pill className="ms-2" color='danger' style={{ fontSize: '0.6em' }}>
                Conflict
              </Badge>
            }
            <br />
          </span>
        ))}
      </div>
    )
  }

  const ConflictModal = ({ conflictEvent, event }) => {
    const [modal, setModal] = useState(false);

    const toggle = () => setModal(!modal);

    const myTimeRanges = [
      { start: conflictEvent.start, end: conflictEvent.end },
      { start: event.start, end: event.end }
    ]
    return (
      <div>
        <Button color="danger" onClick={toggle}>
          View Conflict
        </Button>
        <Modal isOpen={modal} toggle={toggle} size='xl'>
          <ModalHeader toggle={toggle}>{conflictEvent.summary} | <span className='text-decoration-line-through text-danger'> {event.summary} </span></ModalHeader>
          <ModalBody className='px-3'>
            {event.attendees.find((element) => element.resource).displayName}
            {/* TimeLine */}
            <StackedTimelineDraggable timeRanges={myTimeRanges} eventNames={[conflictEvent.summary, event.summary]} />
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={toggle}>
              Do Something
            </Button>{' '}
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }

  return (
    <Container className='my-4'>
      <Row>
        <Col>
          <h2>Approved Events</h2>
          <ListGroup>
            {approvedEvents.map(event => (
              <ListGroupItem key={event.id}>
                <h5>{event.summary}</h5>
                <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}</p>
                <p>{event.description}</p>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>

      <br /><hr /><br />

      <Row>
        <Col>
          <h2>Quick Approve Events</h2>
          <ListGroup>
            {/* Non-Conflicting Events Section */}
            {pendingEvents.quickApprove.map(event => (
              (<ListGroupItem key={event.id} className="d-flex justify-content-between align-items-start">
                <div>
                  {/* Title & ID & Badges */}
                  <h5 className="mb-1">
                    {event.summary} | <small className='text-italic text-secondary'>{event.id}</small>

                    {/* Recurring Badge */}
                    {event.recurrence || event.recurringEventId ? (
                      <Badge bg="info" pill className="ms-2" color='success' style={{ fontSize: '0.6em' }}>
                        Recurring
                      </Badge>
                    ) : null}


                  </h5>

                  <p>Description {event.description}</p>
                  {/* Show all instances of recurring event (times and conflict information) */}
                  {event.recurrence ?
                    <RecurringEventList list={event.instances} />
                    : <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()} </p>
                  }
                </div>
                <Button onClick={() => handleApproveEvent(event.id)}>Approve</Button>
              </ListGroupItem>)
            ))}
          </ListGroup>

          <br />
          <h2>Pending Events</h2>
          <ListGroup>
            {pendingEvents.conflicts.map(event => (
              // Conflict Events
              (<ListGroupItem key={event.id} className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1 text-danger">
                    {event.summary} | <small className='text-italic text-secondary'>{event.id}</small>

                    <Badge bg="info" pill className="ms-2" color='danger' style={{ fontSize: '0.6em' }}>
                      Conflict
                    </Badge>
                  </h5>
                  <p>Description: {event.description}</p>

                  {event.recurrence ?
                    <RecurringEventList list={event.instances} />
                    :
                    <div>
                      <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()} </p>
                      {/* <p>Conflicts with: {event.conflicts[0].summary} | <span className='text-secondary text-italic'>{event.conflicts[0].id}</span></p> */}
                      <ConflictModal conflictEvent={event.conflicts[0]} event={event} />
                    </div>
                  }

                </div>
                <Button onClick={() => handleApproveEvent(event.id)}>Approve</Button>
              </ListGroupItem>)
            ))}
          </ListGroup>

        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
