import React, { useState } from "react";
import { Badge, ListGroupItem, Button, Modal, ModalHeader, ModalBody } from 'reactstrap';
import RecurringEventList from "./RecurringEventList";
import { getRoomNameByCalendarID, parseRRule, formatEventDates } from "../../util/util";
import { useRooms } from "../../context/RoomsContext";
import ViewEventDetails from "./ViewEventDetails";
import '../pages/AdminPortal.css';

const StandardEvent = ({ event, button, badge, pending = true }) => {
  const { rooms } = useRooms();
  const [viewModal, setViewModal] = useState(false);
  const toggleViewModal = () => setViewModal(!viewModal);

  return (
    <ListGroupItem className="d-flex justify-content-between align-items-start">
      <div style={{ flex: 1 }}>
        {/* Title & ID & Badges */}
        <h5 className="mb-1">
          {event.summary} |
          <a
            href={event.htmlLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-italic text-secondary event-link event-id"
            style={{ textDecoration: 'none' }}
          >
            <small>{event.extendedProperties?.private.groupName} {event.id}</small>
          </a>
          {badge}
          {/* Recurring Badge */}
          {event.recurrence || event.recurringEventId ? (
            <Badge bg="info" pill className="ms-2" color='success' style={{ fontSize: '0.6em' }}>
              Recurring
            </Badge>
          ) : null}
        </h5>

        <p>
          {/* Room */}
          {pending ? event.extendedProperties?.private.rooms?.join(', ') :
            event.attendees.filter((attendee) => attendee.resource === true).map((room) => getRoomNameByCalendarID(room.email, rooms)).join(', ')
          }
          <br />
          {/* Description */}
          Description: {event.description || 'No Description Given'}
          <br />
          Congregation: {event.extendedProperties?.private.congregation || 'None'}
        </p>
        {/* Show all instances of recurring event (times and conflict information) */}

        {event.recurrence ? parseRRule(event.recurrence[0]) : null}
        {event.recurrence ?
          <RecurringEventList list={event.instances} />
          : <p>{formatEventDates(event.start.dateTime, event.end.dateTime)} </p>
        }

        {button}
      </div>
      {/* View Button */}
      <div className="ms-2">
        <Button size="sm" color="secondary" onClick={toggleViewModal}>View</Button>
      </div>
      {/* View Modal */}
      <Modal isOpen={viewModal} toggle={toggleViewModal} size="xl">
        <ModalHeader toggle={toggleViewModal}><span className='text-secondary'> {event.summary} </span></ModalHeader>
        <ModalBody className='px-3'>
          <ViewEventDetails event={event} rooms={rooms} />
        </ModalBody>
      </Modal>
    </ListGroupItem>
  )
}

export default StandardEvent