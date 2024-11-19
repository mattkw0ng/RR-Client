import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, ListGroupItem, Button, Badge } from 'reactstrap';
import API_URL from '../../config';

const AdminPage = () => {
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState({ quickApprove: [], conflicts: []});

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

  return (
    <Container>
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
      <br />
      <hr />
      <br />
      <Row>
        <Col>
          <h2>Quick Approve Events</h2>
          <ListGroup>
            {/* Non-Conflicting Events Section */}
            {pendingEvents.quickApprove.map(event => (
              (<ListGroupItem key={event.id} className="d-flex justify-content-between align-items-start">
                <div>
                  <h5 className="mb-1">
                    {event.summary} | <small className='text-italic text-secondary'>{event.id}</small>

                    {/* Recurring Badge */}
                    {event.recurrence || event.recurringEventId ? (
                      <Badge bg="info" pill className="ms-2" color='success' style={{ fontSize: '0.6em' }}>
                        Recurring
                      </Badge>
                    ) : null}


                  </h5>
                  {/* Show all instances of recurring event (times and conflict information) */}
                  {event.recurrence ?
                    event.instances.map(instance => (
                      <div key={instance.id}>
                        <p>{new Date(instance.start.dateTime).toLocaleString()} - {new Date(instance.end.dateTime).toLocaleString()}</p>
                        {instance.conflicts.length === 0 ?
                          null :
                          <Badge bg="info" pill className="ms-2" color='danger' style={{ fontSize: '0.6em' }}>
                            Conflict
                          </Badge>
                        }
                      </div>
                    ))
                    : <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()} </p>
                  }
                  <p>{event.description}</p>
                </div>
                <Button onClick={() => handleApproveEvent(event.id)}>Approve</Button>
              </ListGroupItem>)
            ))}
          </ListGroup>

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
                  <p>{event.description}</p>

                  {event.recurrence ?
                    event.instances.map(instance => (
                      <div key={instance.id}>
                        <p>{new Date(instance.start.dateTime).toLocaleString()} - {new Date(instance.end.dateTime).toLocaleString()}</p>
                        {instance.conflicts.length === 0 ?
                          null :
                          <Badge bg="info" pill className="ms-2" color='danger' style={{ fontSize: '0.6em' }}>
                            Conflict
                          </Badge>
                        }
                      </div>
                    ))
                    :
                    <div>
                      <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()} </p>
                      <p>Conflicts with: {event.conflicts[0].summary} | <span className='text-secondary text-italic'>{event.conflicts[0].id}</span></p>
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
