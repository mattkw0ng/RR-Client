import React from "react";
import { Button, Badge, ListGroupItem } from 'reactstrap';
import RecurringEventList from "./RecurringEventList";
import { format, isSameDay, parseISO } from 'date-fns';

const StandardEvent = ({ event, buttonText, buttonHandler, badge }) => {
  // Display Recurrence Rule as a Sentence
  function parseRecurrenceRule(rrule) {
    const daysMap = {
      MO: "Monday",
      TU: "Tuesday",
      WE: "Wednesday",
      TH: "Thursday",
      FR: "Friday",
      SA: "Saturday",
      SU: "Sunday",
    };

    // Parse the rule into key-value pairs
    const ruleParts = rrule.replace("RRULE:", "").split(";").reduce((acc, part) => {
      const [key, value] = part.split("=");
      acc[key] = value;
      return acc;
    }, {});

    // Get frequency
    let frequency = "";
    if (ruleParts.FREQ) {
      const freqMap = {
        DAILY: "Daily",
        WEEKLY: "Weekly",
        MONTHLY: "Monthly",
        YEARLY: "Yearly",
      };
      frequency = freqMap[ruleParts.FREQ] || "Unknown Frequency";
    }

    // Get days
    let days = "";
    if (ruleParts.BYDAY) {
      const dayList = ruleParts.BYDAY.split(",").map((day) => daysMap[day]);
      days = dayList.length > 1 ? `on ${dayList.join(", ")}` : `on ${dayList[0]}`;
    }

    // Get count
    let count = "";
    if (ruleParts.COUNT) {
      count = `for ${ruleParts.COUNT} ${ruleParts.COUNT === "1" ? "occurrence" : "occurrences"}`;
    }

    // Get interval
    let interval = "";
    if (ruleParts.INTERVAL) {
      interval = `every ${ruleParts.INTERVAL} ${ruleParts.FREQ === "WEEKLY" ? "weeks" : ruleParts.FREQ.toLowerCase()}`;
    }

    // Combine parts into a sentence
    let result = `Repeated ${frequency}`;
    if (interval) result += ` ${interval}`;
    if (days) result += ` ${days}`;
    if (count) result += ` ${count}`;

    return result;
  }

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
          {event.extendedProperties?.private.rooms.map((element) => element.displayName)}
          <br />
          {/* Description */}
          Description: {event.description}
          <br />
          Congregation: {event.extendedProperties?.private.congregation}
        </p>
        {/* Show all instances of recurring event (times and conflict information) */}

        {event.recurrence ? parseRecurrenceRule(event.recurrence[0]) : null}
        {event.recurrence ?
          <RecurringEventList list={event.instances} />
          : <p>{formatEventDates(event.start.dateTime, event.end.dateTime)} </p>
        }
        <br />
        <Button onClick={() => buttonHandler(event.id)} size="sm">{buttonText}</Button>
      </div>
    </ListGroupItem>
  )
}

export default StandardEvent