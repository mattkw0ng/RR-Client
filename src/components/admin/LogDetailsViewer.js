import React from "react";
import { format } from "date-fns";

const LogDetailsViewer = ({ details }) => {
  if (!details) return <em>No details available.</em>;

  // Parse start/end
  const start = details.start?.dateTime
    ? format(new Date(details.start.dateTime), "PPpp")
    : "N/A";
  const end = details.end?.dateTime
    ? format(new Date(details.end.dateTime), "PPpp")
    : "N/A";

  // Parse extended properties
  const ext = details.extendedProperties?.private || {};

  return (
    <div style={{ lineHeight: 1.7 }}>
      <div><strong>Summary:</strong> {details.summary || "N/A"}</div>
      <div><strong>Location:</strong> {details.location || "N/A"}</div>
      <div><strong>Start:</strong> {start}</div>
      <div><strong>End:</strong> {end}</div>
      <div><strong>Group Name:</strong> {ext.groupName || "N/A"}</div>
      <div><strong>Group Leader:</strong> {ext.groupLeader || "N/A"}</div>
      <div><strong>Congregation:</strong> {ext.congregation || "N/A"}</div>
      <div><strong>Number of People:</strong> {ext.numPeople || "N/A"}</div>
      <div><strong>Rooms:</strong> {Array.isArray(ext.rooms) ? ext.rooms.join(", ") : ext.rooms || "N/A"}</div>
      <div><strong>Description:</strong> {details.description || "N/A"}</div>
      {details.recurrence && (
        <div>
          <strong>Recurrence:</strong> {details.recurrence.join(", ")}
        </div>
      )}
      {details.attendees && (
        <div>
          <strong>Attendees:</strong> {details.attendees.map(a => a.email).join(", ")}
        </div>
      )}
    </div>
  );
};

export default LogDetailsViewer;