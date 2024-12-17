import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { congregationOptions, roomListSimple } from "../../data/rooms";
import axios from "axios";
import ROOMS from "../../data/rooms";

import SelectInput from "../form/SelectInput";
import RoomSelector from "./RoomSelector";
import { getRoomNameByCalendarID } from "../../util/util";

const EditEventForm = ({ event, onSubmit, pending }) => {
  const [formState, setFormState] = useState({
    summary: event.summary || "",
    description: event.description || "",
    location: event.location || "",
    startDateTime: event.start?.dateTime || "",
    endDateTime: event.end?.dateTime || "",
    timeZone: event.start?.timeZone || "",
    groupName: event.extendedProperties?.private?.groupName || "",
    groupLeader: event.extendedProperties?.private?.groupLeader || "",
    numPeople: event.extendedProperties?.private?.numPeople || "",
    congregation: event.extendedProperties?.private?.congregation || "",
  });

  const [selectedRooms, setSelectedRooms] = useState(event.pending ? event.extendedProperties.rooms.map((e) => getRoomNameByCalendarID(e.email)) : event.attendees.filter((e) => e.resource).map((e) => getRoomNameByCalendarID(e.email)));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Construct the updated event object
    const updatedEvent = {
      ...event, // Keep existing event data
      summary: formState.summary,
      description: formState.description,
      location: formState.location,
      start: {
        dateTime: formState.startDateTime,
        timeZone: formState.timeZone,
      },
      end: {
        dateTime: formState.endDateTime,
        timeZone: formState.timeZone,
      },
      extendedProperties: {
        private: {
          groupName: formState.groupName,
          groupLeader: formState.groupLeader,
          numPeople: formState.numPeople,
          congregation: formState.congregation,
        },
      },
    };

    // Update the rooms list (depending on if the event is pending or not)
    if (pending) {
      updatedEvent.extendedProperties.private.rooms = selectedRooms.map((roomName) => ({
        email: ROOMS[roomName]?.calendarID || "",
        resource: true,
      }))
    } else {
      updatedEvent.attendees = [
        ...(event.attendees || []).filter((attendee) => !attendee.resource), // Keep non-resource attendees
        ...selectedRooms.map((roomName) => ({
          email: ROOMS[roomName]?.calendarID || "",
          resource: true,
          responseStatus: "accepted",
        })),
      ];
    }

    // Determine if time or room has changed for approved events only
    const timeOrRoomChanged = !pending &&
      event.start?.dateTime !== formState.startDateTime ||
      event.end?.dateTime !== formState.endDateTime ||
      JSON.stringify(
        event.attendees?.filter((attendee) => attendee.resource).map((r) => r.email) || []
      ) !== JSON.stringify(selectedRooms.map((roomName) => ROOMS[roomName]?.calendarID || ""));

    try {
      const response = await axios.post("/editEvent", {
        event: updatedEvent,
        timeOrRoomChanged,
      });

      console.log("Event update response:", response.data);
      alert(response.data.message);
    } catch (error) {
      console.error("Error updating event:", error);
      alert("Failed to update event. Please try again.");
    }
  };

  return (
    <div className="edit-event-form">
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="summary">Event Name</Label>
          <Input
            type="text"
            id="summary"
            name="summary"
            value={formState.summary}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            id="description"
            name="description"
            value={formState.description}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="room">Room(s)</Label>
          <RoomSelector id="room" roomList={roomListSimple} selectedRoom={selectedRooms} setSelectedRoom={setSelectedRooms} multiple={true} />
        </FormGroup>
        <FormGroup>
          <Label for="startDateTime">Start Time</Label>
          <Input
            type="datetime-local"
            id="startDateTime"
            name="startDateTime"
            value={formState.startDateTime.slice(0, 16)} // Ensure the input matches datetime-local format
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="endDateTime">End Time</Label>
          <Input
            type="datetime-local"
            id="endDateTime"
            name="endDateTime"
            value={formState.endDateTime.slice(0, 16)} // Ensure the input matches datetime-local format
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="groupName">Group Name</Label>
          <Input
            type="text"
            id="groupName"
            name="groupName"
            value={formState.groupName}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="groupLeader">Group Leader</Label>
          <Input
            type="text"
            id="groupLeader"
            name="groupLeader"
            value={formState.groupLeader}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="numPeople">Number of People</Label>
          <Input
            type="number"
            id="numPeople"
            name="numPeople"
            value={formState.numPeople}
            onChange={handleChange}
          />
        </FormGroup>
        <SelectInput label={"Congregation"} name={'congregation'} handleFormChange={handleChange} formData={formState} options={congregationOptions} />

        <Button color="primary" type="submit">
          Save Changes
        </Button>
      </Form>
    </div>
  );
};

export default EditEventForm;
