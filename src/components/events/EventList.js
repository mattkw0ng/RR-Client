import React from "react";
import { ListGroup, ListGroupItem, Badge } from 'reactstrap';
import RecurringEventList from "./RecurringEventList";

const EventList = ({ eventList, badge, button }) => {
  return (
    <ListGroup>
      {/* Non-Conflicting Events Section */}
      {eventList.map(event => (
        (<ListGroupItem key={event.id} className="d-flex justify-content-between align-items-start">
          <div>
            {/* Title & ID & Badges */}
            <h5 className="mb-1">
              {event.summary} | <small className='text-italic text-secondary event-id'>{event.id}</small>

              {/* Recurring Badge */}
              {event.recurrence || event.recurringEventId ? (
                <Badge bg="info" pill className="ms-2" color='success'>
                  recurring
                </Badge>
              ) : null}


            </h5>

            <p>
              {/* Room */}
              {event.attendees.find((element) => element.resource).displayName}
              <br />
              {/* Description */}
              Description: {event.description}
              <br />
              Congregation: {event.extendedProperties.private.congregation}
            </p>
            {/* Show all instances of recurring event (times and conflict information) */}
            {event.recurrence ?
              <RecurringEventList list={event.instances} />
              : <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()} </p>
            }
          </div>
          {button}
        </ListGroupItem>)
      ))}
    </ListGroup>
  )
}

export default EventList;