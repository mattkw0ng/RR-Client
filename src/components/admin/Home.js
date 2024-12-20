import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import { ListGroup, ListGroupItem } from "reactstrap";
import API_URL from "../../config";
import { getRoomNameByCalendarID } from "../../util/util";

export default function Home() {
  const [approvedEvents, setApprovedEvents] = useState([]);


  const fetchApprovedEvents = async () => {
    try {
      const response = await axios.get(API_URL + '/api/approvedEvents', { withCredentials: true });
      setApprovedEvents(response.data);
    } catch (error) {
      console.error('Error fetching approved events:', error);
    }
  };

  useEffect(()=> {
    fetchApprovedEvents()
  }, [])

  return (
    <Fragment>
      <iframe title="pendingEvents" src="https://calendar.google.com/calendar/embed?src=c_0430068aa84472bdb1aa16b35d4061cd867e4888a8ace5fa3d830bb67587dfad%40group.calendar.google.com&ctz=America%2FLos_Angeles" style={{ border: 0 }} width="100%" height="650" frameborder="0" ></iframe>

      <div>
        <h4>Upcoming Events</h4>
        <ListGroup>
          {approvedEvents.map(event => (
            <ListGroupItem key={event.id}>
              <h4>{event.summary}</h4>
              <p>{new Date(event.start.dateTime).toLocaleString()} - {new Date(event.end.dateTime).toLocaleString()}</p>
              {
                event.attendees.filter((a) => a.resource === true).map((attendee) => (
                  <p>{getRoomNameByCalendarID(attendee.email)}</p>
                ))
              }
              <p>{event.description}</p>
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </Fragment>
  )
}