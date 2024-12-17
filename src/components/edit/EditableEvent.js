import React from "react";
import { ListGroupItem, Badge } from "reactstrap";
import RecurringEventList from "../events/RecurringEventList";

export default function EditableEvent({ event, modal }) {

  return (<ListGroupItem key={event.id} className="d-flex justify-content-between align-items-start">
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
            {modal}
          </div>
        )

      }

    </div>
  </ListGroupItem>)
}