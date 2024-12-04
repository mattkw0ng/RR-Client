import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Row, Col, ListGroup, ListGroupItem, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import API_URL from '../../config';
import { ADMINEVENTS } from '../../data/example';

import StandardEvent from '../events/StandardEvent';
import ConflictEditor from '../edit/ConflictEditor';

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
      console.log("PendingEvents()", response.data);
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

  const ConflictModal = ({ approvedEvents, pendingEvent }) => {
    const [modal, setModal] = useState(false);


    const toggle = () => setModal(!modal);

    return (
      <div>
        <Button color="danger" onClick={toggle}>
          View Conflict
        </Button>
        <Modal isOpen={modal} toggle={toggle} size='xl'>
          <ModalHeader toggle={toggle}>{approvedEvents.summary} | <span className='text-decoration-line-through text-danger'> {pendingEvent.summary} </span></ModalHeader>
          <ModalBody className='px-3'>
            {pendingEvent.attendees.find((element) => element.resource).displayName}
            {/* TimeLine */}
            {/* <StackedTimelineDraggable timeRanges={myTimeRanges} eventNames={[approvedEvents[0].summary, event.summary]} /> */}

            <ConflictEditor approvedEvents={approvedEvents} pendingEvent={pendingEvent} conflictId={pendingEvent.id} />
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
          <iframe title="pendingEvents" src="https://calendar.google.com/calendar/embed?src=c_0430068aa84472bdb1aa16b35d4061cd867e4888a8ace5fa3d830bb67587dfad%40group.calendar.google.com&ctz=America%2FLos_Angeles" style={{ border: 0 }} width="100%" height="500" frameborder="0" ></iframe>
        </Col>
        <Col>
          <h2>Quick Approve Events</h2>
          <ListGroup>
            {/* Non-Conflicting Events Section */}

            {pendingEvents.quickApprove.map(event => (
              (<StandardEvent key={event.id} event={event} buttonText={"Approve"} buttonHandler={handleApproveEvent} />)
            ))}
          </ListGroup>

          <br />
          <h3>Conflicts</h3>
          <ListGroup>
            {pendingEvents.conflicts.map(event => (
              // Conflict Events
              (<ListGroupItem key={event.id} className="d-flex justify-content-between align-items-start">
                <div>
                  {/* Title */}
                  <h5 className="mb-1 text-danger">
                    {event.summary} | <small className='text-italic text-secondary'>{event.id}</small>

                    <Badge bg="info" pill className="ms-2" color='danger' style={{ fontSize: '0.6em' }}>
                      Conflict
                    </Badge>
                  </h5>

                  {/* Details */}
                  <p>
                    {/* Room */}
                    {event.attendees.filter((element) => element.resource)?.map((room) => <p>{room.displayName}</p>)}
                    <br />
                    {/* Description */}
                    Description: {event.description}
                    <br />
                    Congregation: {event.extendedProperties.private.congregation}
                  </p>

                  {event.recurrence ?
                    <RecurringEventList list={event.instances} />
                    :
                    event.conflicts.map((conflict) => 
                      <div id={conflict.id}>
                        <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()} </p>
                        {/* <p>Conflicts with: {event.conflicts[0].summary} | <span className='text-secondary text-italic'>{event.conflicts[0].id}</span></p> */}
                        <ConflictModal approvedEvents={conflict} pendingEvent={event} />
                      </div>
                    )

                  }

                </div>
              </ListGroupItem>)
            ))}
          </ListGroup>

        </Col>
      </Row>


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
    </Container>
  );
};

export default AdminPage;
