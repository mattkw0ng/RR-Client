import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, ListGroup, ListGroupItem, Button, Badge, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import API_URL from '../../config';
import { ADMINEVENTS } from '../../data/example';

import StandardEvent from '../events/StandardEvent';
import ConflictEditor from '../edit/ConflictEditor';

const AdminPage = () => {
  const [pendingEvents, setPendingEvents] = useState(ADMINEVENTS);
  const [proposedChangesEvents, setProposedChangesEvents] = useState([]);

  const fetchPendingEvents = async () => {
    try {
      const response = await axios.get(API_URL + '/api/pendingEventsWithConflicts', { withCredentials: true });
      console.log("PendingEvents()", response.data);

      // Parse JSON object
      for (const elem of response.data.quickApprove) {
        elem.extendedProperties.private.rooms = JSON.parse(elem.extendedProperties.private.rooms);
      }
      for (const elem of response.data.conflicts) {
        elem.extendedProperties.private.rooms = JSON.parse(elem.extendedProperties.private.rooms);
      }
      setPendingEvents(response.data);
    } catch (error) {
      console.error('Error fetching pending events:', error);
    }
  };

  const fetchProposedChangesEvents = async () => {
    try {
      const response = await axios.get(API_URL + '/api/proposedChangesEvents', { withCredentials: true });
      setProposedChangesEvents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching proposedChanges events: ', error);
    }
  }

  useEffect(() => {
    fetchPendingEvents();
    fetchProposedChangesEvents();
  }, []);

  const handleApproveEvent = async (eventId) => {
    console.log("Approving", eventId);
    axios.post(API_URL + '/api/approveEvent', { eventId }, { withCredentials: true })
      .then(response => {
        alert('Event approved successfully:', response.data);
        fetchPendingEvents();
        // Optionally, you could trigger a re-render or refresh the list of pending events
      })
      .catch(error => {
        console.error('Error approving event:', error.response ? error.response.data : error.message);
      });
  };

  const quickApproveAll = async () => {
    console.log("Quick Approving All");
  }

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

  const ConflictModal = ({ approvedEvents, pendingEvent, roomId }) => {
    const [modal, setModal] = useState(false);
    console.log(approvedEvents);

    const toggle = () => setModal(!modal);

    return (
      <div>
        <Button color="danger" onClick={toggle}>
          View Conflict
        </Button>
        <Modal isOpen={modal} toggle={toggle} size='xl'>
          <ModalHeader toggle={toggle}><span className='text-danger'> {pendingEvent.summary} </span></ModalHeader>
          <ModalBody className='px-3'>

            {/* TimeLine */}
            {/* <StackedTimelineDraggable timeRanges={myTimeRanges} eventNames={[approvedEvents[0].summary, event.summary]} /> */}
            <ConflictEditor pendingEvent={pendingEvent} conflictId={pendingEvent.id} roomId={roomId} />
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
      <div>
        <div className='d-flex justify-content-between'>
          <h4 className='d-inline'>Quick Approve Events</h4> <Button size='sm' color='primary' outline className='d-inline' onClick={() => quickApproveAll()}>Approve All</Button>
        </div>
        <ListGroup>
          {/* Non-Conflicting Events Section */}

          {pendingEvents.quickApprove.map(event => (
            (<StandardEvent key={event.id} event={event} button={<Button onClick={() => handleApproveEvent(event.id)} size="sm">Approve</Button>} />)
          ))}
        </ListGroup>
      </div>

      <div>
        <h4>Conflicts</h4>
        <ListGroup>
          {pendingEvents.conflicts.map(event => (
            // Conflict Events
            (<ListGroupItem key={event.id} className="d-flex justify-content-between align-items-start">
              <div>
                {/* Title */}
                <h4 className="mb-1 text-danger">
                  {event.summary} | <small className='text-italic text-secondary'>{event.id}</small>

                  <Badge bg="info" pill className="ms-2" color='danger' style={{ fontSize: '0.6em' }}>
                    Conflict
                  </Badge>
                </h4>

                {/* Details */}
                <p>
                  {/* Room */}
                  {event.extendedProperties.private.rooms.map((room) => <p key={room.email}>{room.displayName}</p>)}
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
                    <div id={conflict.roomId}>
                      <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()} </p>
                      {/* <p>Conflicts with: {event.conflicts[0].summary} | <span className='text-secondary text-italic'>{event.conflicts[0].id}</span></p> */}
                      <ConflictModal approvedEvents={conflict} pendingEvent={event} roomId={conflict.roomId} />
                    </div>
                  )

                }

              </div>
            </ListGroupItem>)
          ))}
        </ListGroup>
      </div>

      <div>
        <div className='d-flex justify-content-between'>
          <h4 className='d-inline'>Proposed Changes</h4>
        </div>
        <ListGroup>
          {/* Non-Conflicting Events Section */}

          {proposedChangesEvents.map(event => (
            (<StandardEvent key={event.id} event={event} button={<Button onClick={() => handleApproveEvent(event.id)} size="sm">Accept</Button>} />)
          ))}
        </ListGroup>
      </div>



    </Container>
  );
};

export default AdminPage;
