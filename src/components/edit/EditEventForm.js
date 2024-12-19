import React, { useState, useEffect } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { congregationOptions, roomListSimple } from "../../data/rooms";
import axios from "axios";
import ROOMS from "../../data/rooms";

import SelectInput from "../form/SelectInput";
import RoomSelector from "./RoomSelector";
import { getRoomNameByCalendarID } from "../../util/util";
import API_URL from "../../config";

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

  const [selectedRooms, setSelectedRooms] = useState(pending ? JSON.parse(event.extendedProperties.private.rooms).map((e) => getRoomNameByCalendarID(e.email)) : event.attendees.filter((e) => e.resource).map((e) => getRoomNameByCalendarID(e.email)));

  const hasRoomsChanged = (original, updated) => {
    const originalRooms = new Set(
      original
    );
    const updatedRooms = new Set(
      updated
    );
  
    // Check if the sets have different sizes or different elements
    if (originalRooms.size !== updatedRooms.size) {
      return true; // Size mismatch means the lists have changed
    }
  
    // Check if every element in `originalRooms` exists in `updatedRooms`
    for (const room of originalRooms) {
      if (!updatedRooms.has(room)) {
        return true; // An element is missing in the updated list
      }
    }
  
    return false; // The sets are identical
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Submit Changes
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

    let timeOrRoomChanged = false;
    const roomListAsAttendees = selectedRooms.map((roomName) => ({
      email: ROOMS[roomName]?.calendarID || "",
      resource: true,
    }));

    // Update the rooms list (depending on if the event is pending or not)
    if (pending) {
      // If the event is pending, add the new set of rooms to extendedProperties.private.rooms
      updatedEvent.extendedProperties.private.rooms = JSON.stringify(roomListAsAttendees);
    } else {
      // Determine if the time or room list has been changed
      timeOrRoomChanged = event.start?.dateTime !== formState.startDateTime ||
        event.end?.dateTime !== formState.endDateTime ||
        hasRoomsChanged(event.attendees?.filter((attendee) => attendee.resource).map((r) => r.email) || [], selectedRooms.map((roomName) => ROOMS[roomName]?.calendarID || ""));

      if (timeOrRoomChanged) {
        // If the event was approved and the rooms/time have been modified, save the attendee information but move the rooms to extendedProperties.rooms (like a normal pending event)
        updatedEvent.attendees = (event.attendees || []).filter((attendee) => !attendee.resource) // Keep non-resource attendees
        updatedEvent.extendedProperties.private.rooms = JSON.stringify(roomListAsAttendees); // Mirrors a typical pending event by storing room information under extendedProperies
      } else {
        // Else if only non-room/date/time information was changed, attendees should stay the same
        updatedEvent.attendees = event.attendees
      }
    }

    try {
      console.log({
        event: updatedEvent,
        timeOrRoomChanged,
      })

      const response = await axios.post(API_URL + "/api/editEvent", {
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

  useEffect(() => {
    console.log(event, selectedRooms, JSON.parse(event.extendedProperties.private.rooms).map((e) => getRoomNameByCalendarID(e.email)), pending);
  },[selectedRooms, event, pending])

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
