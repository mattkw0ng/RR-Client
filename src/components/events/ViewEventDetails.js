import React from "react";
import { Table } from "reactstrap";
import { getRoomNameByCalendarID } from "../../util/util";

const ViewEventDetails = ({ event, rooms }) => {
  const {
    description,
    start,
    end,
    extendedProperties,
    attendees,
  } = event;
  
  console.log("ViewEventDetails: ", event);

  const roomsList = attendees
    ?.filter((attendee) => attendee.resource)
    .map((room) => getRoomNameByCalendarID(room.email, rooms))
    .join(", ") || "None";

  return (
    <div className="view-event-details">
      <Table bordered>
        <tbody>
          <tr>
            <td><strong>Description</strong></td>
            <td>{description || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>Start Time</strong></td>
            <td>{new Date(start?.dateTime).toLocaleString() || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>End Time</strong></td>
            <td>{new Date(end?.dateTime).toLocaleString() || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>Rooms</strong></td>
            <td>{roomsList}</td>
          </tr>
          <tr>
            <td><strong>Group Name</strong></td>
            <td>{extendedProperties?.private?.groupName || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>Group Leader</strong></td>
            <td>{extendedProperties?.private?.groupLeader || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>Number of People</strong></td>
            <td>{extendedProperties?.private?.numPeople || "N/A"}</td>
          </tr>
          <tr>
            <td><strong>Congregation</strong></td>
            <td>{extendedProperties?.private?.congregation || "N/A"}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default ViewEventDetails;