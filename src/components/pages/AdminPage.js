import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, ListGroupItem, Button } from 'reactstrap';
import API_URL from '../../config';

const AdminPage = () => {
  const [approvedEvents, setApprovedEvents] = useState([]);
  const [pendingEvents, setPendingEvents] = useState([]);

  const fetchApprovedEvents = async () => {
    try {
      const response = await axios.get(API_URL + '/api/approvedEvents', { withCredentials: true});
      setApprovedEvents(response.data);
    } catch (error) {
      console.error('Error fetching approved events:', error);
    }
  };

  const fetchPendingEvents = async () => {
    try {
      const response = await axios.get(API_URL + '/api/pendingEvents', { withCredentials: true});
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
    axios.post(API_URL + '/api/approveEvent', { eventId }, { withCredentials: true})
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
          <h2>Pending Events</h2>
          <ListGroup>
            {pendingEvents.map(event => (
              <ListGroupItem key={event.id}>
                <h5>{event.summary}</h5>
                <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}</p>
                <p>{event.description}</p>
                <Button onClick={() => handleApproveEvent(event.id)}>Approve</Button>
              </ListGroupItem>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminPage;
