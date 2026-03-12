import React, { useState, Fragment } from "react";
import { Button, ModalBody, ModalFooter, FormGroup, Label, Input } from "reactstrap";
import { getRoomNameByCalendarID, formatEventDates } from "../../util/util";
import SideBySideEvents from "../edit/SideBySideEvents";
import { useRooms } from "../../context/RoomsContext";

/**
 * AdminApprovalViewer
 * Displays event details side by side for admin approval, with message input and approve/reject buttons.
 * @param {Object} pendingEvent - The event pending approval
 * @param {Object[]} approvedEvents - The events already approved for the room
 * @param {Function} handleApprove - Function to call on approve (receives message)
 * @param {Function} handleReject - Function to call on reject
 * @param {Function} toggle - Function to close the modal
 */
const AdminApprovalViewer = ({ pendingEvent, approvedEvents, handleApprove, handleReject, toggle, message, setMessage }) => {
  const { rooms } = useRooms();

  return (
    <Fragment>
      <ModalBody className="px-3">
        <div>
          <div className="d-flex gap-2">
            <SideBySideEvents
              approvedEvents={approvedEvents}
              pendingEvents={[pendingEvent]}
              roomName={getRoomNameByCalendarID(pendingEvent.extendedProperties?.private?.rooms?.[0]?.email, rooms)}
            />
          </div>

          {/* Detailed Event Information */}
          <div className="mt-3 mb-3 p-2 border rounded bg-light">
            <h5 className="mb-2">Event Details</h5>
            <p><strong>Event Name:</strong> {pendingEvent.summary}</p>
            <p><strong>Date & Time:</strong> {formatEventDates(pendingEvent.start.dateTime, pendingEvent.end.dateTime)}</p>
            <p><strong>Location:</strong> {pendingEvent.location}</p>
            <p><strong>Room:</strong> {getRoomNameByCalendarID(pendingEvent.extendedProperties?.private?.rooms?.[0]?.email, rooms)}</p>
            <p><strong>Group Name:</strong> {pendingEvent.extendedProperties?.private?.groupName}</p>
            <p><strong>Group Leader:</strong> {pendingEvent.extendedProperties?.private?.groupLeader}</p>
            <p><strong>Congregation:</strong> {pendingEvent.extendedProperties?.private?.congregation}</p>
            <p><strong>Number of People:</strong> {pendingEvent.extendedProperties?.private?.numPeople}</p>
            <p><strong>Description:</strong> {pendingEvent.description}</p>
          </div>

          {/* Message Input for Admin */}
          <FormGroup className="mb-3">
            <Label for="adminMessage">Message to Requester (optional):</Label>
            <Input
              type="textarea"
              id="adminMessage"
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Write a message to the requester..."
            />
          </FormGroup>
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => handleApprove(message)}>
          Approve{message ? " with Message" : ""}
        </Button>{' '}
        <Button color="secondary" onClick={handleReject}>
          Reject
        </Button>
        <Button color="light" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Fragment>
  );
};

export default AdminApprovalViewer;
