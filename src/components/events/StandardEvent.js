import React from "react";
import { Badge, ListGroupItem } from 'reactstrap';
import RecurringEventList from "./RecurringEventList";
import { getRoomNameByCalendarID, parseRRule, formatEventDates } from "../../util/util";

const StandardEvent = ({ event, button, badge, pending=true }) => {

  return (
    <ListGroupItem className="d-flex justify-content-between align-items-start">
      <div>
        {/* Title & ID & Badges */}
        <h5 className="mb-1">
          {event.summary} | <small className='text-italic text-secondary event-id'>{event.id}</small>
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
          {pending ? event.extendedProperties?.private.rooms?.map((room) => getRoomNameByCalendarID(room.email)).join(', ') :
            event.attendees.filter((attendee) => attendee.resource === true).map((room) => getRoomNameByCalendarID(room.email)).join(', ')
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
    </ListGroupItem>
  )
}

export default StandardEvent