import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Container, ListGroup, ListGroupItem, Button, Badge, Modal, ModalHeader, } from 'reactstrap';
import LoadingOverlay from '../lightbox/LoadingOverlay';
import API_URL from '../../config';

import StandardEvent from '../events/StandardEvent';
import ConflictEditor from '../edit/ConflictEditor';
import ROOMS from '../../data/rooms';

const AdminPage = ({fetchNumPendingEvents}) => {
  const [pendingEvents, setPendingEvents] = useState({ 'quickApprove': [], 'conflicts': [] });
  const [proposedChangesEvents, setProposedChangesEvents] = useState([]);
  const [isNotEmpty, setIsNotEmpty] = useState(false);
  const [loading, setLoading] = useState(false);

  // Wrap fetchPendingEvents in useCallback
  const fetchPendingEvents = useCallback(async () => {
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
      setIsNotEmpty(response.data.quickApprove.length !== 0 || response.data.conflicts.length !== 0);
      fetchNumPendingEvents();
    } catch (error) {
      console.error('Error fetching pending events:', error);
    }
  }, [fetchNumPendingEvents]); // Add fetchNumPendingEvents as a dependency

  const fetchProposedChangesEvents = async () => {
    try {
      const response = await axios.get(API_URL + `/api/proposedChangesEvents?isUser=${false}`, { withCredentials: true });
      setProposedChangesEvents(response.data);
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching proposedChanges events: ', error);
    }
  }

  useEffect(() => {
    fetchPendingEvents();
    fetchProposedChangesEvents();
  }, [fetchPendingEvents]);

  const handleApproveEvent = async (eventId) => {
    console.log("Approving", eventId);
    setLoading(true);

    axios.post(API_URL + '/api/approveEvent', { eventId }, { withCredentials: true })
      .then(response => {
        alert('Event approved successfully:', response.data);
        fetchPendingEvents();
      })
      .catch(error => {
        console.error('Error approving event:', error.response ? error.response.data : error.message);
      }).finally(() => {
        setLoading(false);
      });
  };

  const handleRejectEvent = async (eventId) => {
    console.log("Rejecting event:", eventId);
    setLoading(true);

    try {
      const response = await axios.delete(`${API_URL}/api/rejectEvent`, {
        data: { eventId }, // Pass the eventId in the request body
        withCredentials: true,
      });
      alert('Event rejected successfully:', response.data);
      fetchPendingEvents(); // Refresh the list of pending events
    } catch (error) {
      console.error('Error rejecting event:', error.response ? error.response.data : error.message);
      alert('Failed to reject event. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptChanges = async (eventId) => {
    console.log("Accepting Changes", eventId);
    axios.post(API_URL + '/api/acceptProposedChanges', { eventId }, { withCredentials: true })
      .then(response => {
        alert('Event accepted successfully:', response.data);
        fetchPendingEvents();
      })
      .catch(error => {
        console.error('Error accepting changes:', error.response ? error.response.data : error.message);
      });
  };

  const handleSubmitChanges = async (originalRoomId, selectedRoom, editedEvent, originalEvent) => {
    console.log("Submitting Changes", originalRoomId, editedEvent, selectedRoom);
    if (selectedRoom !== "") {
      // if the room has been changed, delete the original room id and put new one
      const peopleAttendees = editedEvent.attendees.filter((attendee) => attendee.resource !== true);
      // filter out the original room and then insert the selected room into the rooms list
      const swapRooms = editedEvent.extendedProperties.private.rooms.filter((attendee) => attendee.email !== originalRoomId);

      editedEvent.attendees = peopleAttendees;
      const finalEdits = {
        rooms: JSON.stringify([
          ...swapRooms,
          {
            "email": ROOMS[selectedRoom].calendarID,
            "resource": true
          }
        ]),
        originalStart: originalEvent.start.dateTime,
        originalEnd: originalEvent.end.dateTime,
        originalRooms: JSON.stringify(originalEvent.extendedProperties.private.rooms)
      } // add rooms to extended properties and add the other selected room
      editedEvent.extendedProperties.private = {
        ...editedEvent.extendedProperties.private,
        ...finalEdits
      }
    }

    console.log("Swapped rooms", editedEvent);

    axios.post(API_URL + '/api/editEvent', {
      event: editedEvent,
      timeOrRoomChanged: true,
      adminEdit: true
    })
  }

  const quickApproveAll = async () => {
    console.log("Quick Approving All");
    const eventIdList = pendingEvents?.quickApprove.map((e) => e.id);
    axios.post(API_URL + '/api/quickApprove', { eventIdList }, { withCredentials: true }).then(response => {
      alert('Event approved successfully:', response.data);
      fetchPendingEvents();
    })
      .catch(error => {
        console.error('Error approving event:', error.response ? error.response.data : error.message);
      });
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
        <Button color="danger" size='sm' onClick={toggle}>
          View Conflict
        </Button>
        <Modal isOpen={modal} toggle={toggle} size='xl'>
          <ModalHeader toggle={toggle}><span className='text-danger'> {pendingEvent.summary} </span></ModalHeader>
          {pendingEvent.extendedProperties.private.conflictMessage ? <p id='conflictMessage' className='conflict-message p-3 mb-0'>Note: {pendingEvent.extendedProperties.private.conflictMessage}</p> : null}
          {/* TimeLine */}
          {/* <StackedTimelineDraggable timeRanges={myTimeRanges} eventNames={[approvedEvents[0].summary, event.summary]} /> */}
          <ConflictEditor pendingEvent={pendingEvent} conflictId={pendingEvent.id} roomId={roomId} handleSubmitChanges={handleSubmitChanges} toggle={toggle} />
        </Modal>
      </div>
    );
  }

  return (
    <Container className='my-4'>
      <LoadingOverlay loading={loading} />
      {isNotEmpty || proposedChangesEvents.length !== 0 ? null : <p>No incoming reservation requests found.</p>}
      <div className='mb-4'>
        {
          pendingEvents.quickApprove.length > 0 &&
          <div className='d-flex justify-content-between mb-2'>
            <h4 className='d-inline'>Quick Approve Events</h4> <Button size='sm' color='primary' outline className='d-inline' onClick={() => quickApproveAll()}>Approve All</Button>
          </div>
        }
        <ListGroup>
          {/* Non-Conflicting Events Section */}
          {pendingEvents.quickApprove.map(event => {
            const btns = <div className='d-flex gap-2'>
              <Button onClick={() => handleApproveEvent(event.id)} size="sm" color='primary'>Approve</Button>
              <Button onClick={() => handleRejectEvent(event.id)} size="sm" color='danger'>Reject</Button>
            </div>
            return (<StandardEvent key={event.id} event={event} button={btns} />)
          })}
        </ListGroup>
      </div>

      <div>
        {pendingEvents.conflicts.length > 0 && <h4>Conflicts</h4>}
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
                      <div className='d-flex gap-2'>
                        <Button color="secondary" size='sm' onClick={() => handleRejectEvent(event.id)}>  Reject</Button>
                        <ConflictModal approvedEvents={conflict} pendingEvent={event} roomId={conflict.roomId} />
                      </div>
                    </div>
                  )

                }

              </div>
            </ListGroupItem>)
          ))}
        </ListGroup>
      </div>

      <div>
        {
          proposedChangesEvents.length > 0 &&
          <div className='d-flex justify-content-between'>
            <h4 className='d-inline'>Proposed Changes</h4>
          </div>
        }
        <ListGroup>
          {/* Non-Conflicting Events Section */}

          {proposedChangesEvents.map(event => (
            (<StandardEvent key={event.id} event={event} button={<Button onClick={() => handleAcceptChanges(event.id)} size="sm">Accept</Button>} />)
          ))}
        </ListGroup>
      </div>
    </Container>
  );
};

export default AdminPage;
