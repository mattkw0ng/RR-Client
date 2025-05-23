import React, { useState } from "react";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";
import { congregationOptions } from "../../data/rooms";
import axios from "axios";

import SelectInput from "../form/SelectInput";
import RoomSelector from "./RoomSelector";
import { getRoomNameByCalendarID } from "../../util/util";
import API_URL from "../../config";

const EditEventForm = ({ event, onSubmit, pending, setModal, rooms }) => {

  // Extract the original description using regex
  const originalDescriptionMatch = event.description.match(/^(.*?)(?=\s*- Group Name:)/s);
  const originalDescription = originalDescriptionMatch ? originalDescriptionMatch[1].trim() : event.description;

  const [formState, setFormState] = useState({
    summary: event.summary || "",
    description: originalDescription || "",
    location: event.location || "",
    startDateTime: event.start?.dateTime || "",
    endDateTime: event.end?.dateTime || "",
    timeZone: event.start?.timeZone || "",
    groupName: event.extendedProperties?.private?.groupName || "",
    groupLeader: event.extendedProperties?.private?.groupLeader || "",
    numPeople: event.extendedProperties?.private?.numPeople || "",
    congregation: event.extendedProperties?.private?.congregation || "",
  });

  const [selectedRooms, setSelectedRooms] = useState(pending ? event.extendedProperties.private.rooms.map((e) => getRoomNameByCalendarID(e.email, rooms)) : event.attendees.filter((e) => e.resource).map((e) => getRoomNameByCalendarID(e.email, rooms)));

  const hasRoomsChanged = (original, updated) => {
    console.log("Chekcing if rooms have changed");
    console.log("Original rooms:", original);
    console.log("Updated rooms:", updated);
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

    // Reconstruct the full description with the extra details
    const fullDescription = `${formState.description}
      - Group Name: ${formState.groupName}
      - Group Leader: ${formState.groupLeader}
      - Congregation: ${formState.congregation}
      - Number of People: ${formState.numPeople}`;


    // Construct the updated event object
    const updatedEvent = {
      ...event, // Keep existing event data
      summary: formState.summary,
      description: fullDescription,
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
      email: rooms.rooms[roomName]?.calendarID || "",
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
        hasRoomsChanged(event.attendees?.filter((attendee) => attendee.resource).map((r) => r.email) || [], selectedRooms.map((roomName) => rooms.rooms[roomName].calendarID || ""));

      if (timeOrRoomChanged) {
        console.log("Time or room has been changed");
        console.log("Original rooms:", event.attendees?.filter((attendee) => attendee.resource).map((r) => r.email));
        console.log("Updated rooms:", selectedRooms.map((roomName) => rooms.rooms[roomName]?.calendarID || ""));
        console.log("Original start time:", event.start?.dateTime);
        console.log("Updated start time:", formState.startDateTime);
        console.log("Original end time:", event.end?.dateTime);
        console.log("Updated end time:", formState.endDateTime);
        // If the event was approved and the rooms/time have been modified, save the attendee information but move the rooms to extendedProperties.rooms (like a normal pending event)
        updatedEvent.attendees = (event.attendees || []).filter((attendee) => attendee.resource !== true) // Keep non-resource attendees
        updatedEvent.extendedProperties.private.rooms = JSON.stringify(roomListAsAttendees); // Mirrors a typical pending event by storing room information under extendedProperies
        console.log("updated event's attendees", updatedEvent.attendees);
        console.log("updated event's extended properties", updatedEvent.extendedProperties);
        // Prompt exit
        const confirmation = window.confirm("This event will have to undergo another round of approval for the change in time or room(s) -- Would you like to continue?");
        if (!confirmation) {
          return; // Exit if the user cancels
        }
      } else {
        // Else if only non-room/date/time information was changed, attendees should stay the same
        updatedEvent.attendees = event.attendees
      }
    }

    try {
      // console.log({
      //   event: updatedEvent,
      //   timeOrRoomChanged,
      // })

      const response = await axios.post(API_URL + "/api/editEvent", {
        event: updatedEvent,
        timeOrRoomChanged,
      });

      console.log("Event update response:", response.data);
      alert(response.data.message);
      onSubmit(setModal);
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
          <RoomSelector id="room" roomList={rooms.roomListSimple} selectedRoom={selectedRooms} setSelectedRoom={setSelectedRooms} multiple={true} />
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
