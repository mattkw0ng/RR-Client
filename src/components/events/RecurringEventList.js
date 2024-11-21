import React from "react";
import { Badge } from "reactstrap";
import { format, isSameDay, parseISO } from 'date-fns';

const RecurringEventList = ({ list }) => {

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
    <div>
      {list.map(instance => (
        <span key={instance.id}>
          {formatEventDates(instance.start.dateTime, instance.end.dateTime)}
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

export default RecurringEventList;