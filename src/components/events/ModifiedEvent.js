import React from "react";
import { Badge, ListGroupItem } from 'reactstrap';
import RecurringEventList from "./RecurringEventList";
import { format, isSameDay, parseISO } from 'date-fns';
import { getRoomNameByCalendarID, parseRRule } from "../../util/util";

const ModifiedEvent = ({ event, button, badge}) => {

  // Display Event Dates Neatly
  function formatEventDates(startDate, endDate) {
    const start = parseISO(startDate);
    const end = parseISO(endDate);

    // Format for single time range if both dates are on the same day
    if (isSameDay(start, end)) {
      return `${format(start, 'eee, MMM do h:mmaaa')}-${format(end, 'h:mmaaa')}`;
    }

    // Format separately if the dates are on different days
    return `${format(start, 'eee, MMM do h:mmaaa')} - ${format(end, 'eee, MMM do h:mmaaa')}`;
  }

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
          <p>{event.extendedProperties?.private.rooms?.map((room) => getRoomNameByCalendarID(room.email)).join(', ')}</p>
          <p className="text-secondary text-decoration-line-through fst-italic">{event.extendedProperties.private.originalRooms?.map((room) => getRoomNameByCalendarID(room.email)).join(', ')}</p>
          <br />
          {/* Description */}
          Description: {event.description}
          <br />
          Congregation: {event.extendedProperties?.private.congregation}
        </p>
        {/* Show all instances of recurring event (times and conflict information) */}

        {event.recurrence ? parseRRule(event.recurrence[0]) : null}
        {event.recurrence ?
          <RecurringEventList list={event.instances} />
          : <p>{formatEventDates(event.start.dateTime, event.end.dateTime)} &lt; <span className="text-secondary fst-italic">{formatEventDates(event.extendedProperties.private.originalStart, event.extendedProperties.private.originalEnd)}</span></p>
        }

        {button}
      </div>
    </ListGroupItem>
  )
}

export default ModifiedEvent