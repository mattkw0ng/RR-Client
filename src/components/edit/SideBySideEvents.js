import React, { useEffect, useState } from "react";
import "./SideBySideEvents.css";
import { areTimeRangesOverlapping } from "../../util/util";

const SideBySideEvents = ({ approvedEvents, pendingEvents, conflictId }) => {
  const timeRangeStart = 6; // Start time for the timeline (6:00 AM)
  const timeRangeEnd = 23; // End time for the timeline (10:00 PM)
  const totalHours = timeRangeEnd - timeRangeStart;
  const [isOverlap, setIsOverlap] = useState(false);

  // Calculate position and height for events
  const calculatePosition = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Convert times to hours since the start of the timeline
    const startHours = start.getHours() + start.getMinutes() / 60;
    const endHours = end.getHours() + end.getMinutes() / 60;

    // Calculate top and height percentages
    const top = ((startHours - timeRangeStart) / totalHours) * 100;
    const height = ((endHours - startHours) / totalHours) * 100;

    return { top: `${top}%`, height: `${height}%` };
  };

  const checkOverlap = () => {
    const pendingEvent = pendingEvents.find((e) => e.id === conflictId);
    let isOverlapping = false;
    for (const event of approvedEvents) {
      const result = areTimeRangesOverlapping(pendingEvent, event);
      console.log([pendingEvent, event, result, isOverlapping])

      isOverlapping = (isOverlapping || result)
    }
    for (const event of pendingEvents.filter((e) => e.id !== conflictId)) {
      const result = areTimeRangesOverlapping(pendingEvent, event);
      console.log([pendingEvent, event, result, isOverlapping])

      isOverlapping = (isOverlapping || result)
    }

    setIsOverlap(isOverlapping)
    console.log("final result", isOverlapping);
  }

  useEffect(() => {
    console.log("Checking overlap");
    checkOverlap()
  })

  const conflictEventGradient = isOverlap ? 'conflict-event gradient-red' : 'conflict-event gradient-green';

  const EventColumn = ({ eventStatus, events }) => {
    return (
      <div className="event-container">
        {events.map((event) => {
          const { top, height } = calculatePosition(event.start.dateTime, event.end.dateTime);
          return (
            <div
              key={event.id}
              className={`event ${eventStatus}-event ${conflictId === event.id ? conflictEventGradient : eventStatus === 'approved' ? 'gradient-blue' : 'gradient-gray'}`}
              style={{ top, height }}
            >
              <strong className="d-inline">{event.summary}&nbsp;</strong>
              <p className="d-inline">| {new Date(event.start.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(event.end.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          );
        })}
      </div>
    )
  }

  return (
    <div className="side-by-side-events">
      <div className="column approved-column">
        <h5>Approved Events</h5>
        <EventColumn eventStatus={"approved"} events={approvedEvents} />
      </div>
      <div className="divider" />
      <div className="column pending-column">
        <h5>Pending Events</h5>
        <EventColumn eventStatus={"pending"} events={pendingEvents} />
      </div>
    </div>
  );
};

export default SideBySideEvents;
