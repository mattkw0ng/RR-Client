import React, { useState, useEffect } from "react";
import axios from 'axios';
import API_URL from "../../config";
// import ConflictTimeline from "./ConflictTimeline";
import { AVAILABLE_ROOMS, ROOMEVENTS } from "../../data/example";
import RoomSelector from "./RoomSelector";
import SideBySideEvents from "./SideBySideEvents";


/**
 * 
 * @param {Object} pendingEvent the pending event that is in conflict with some other event 
 */
const ConflictEditor = ({ approvedEvents, pendingEvent , conflictId, roomId}) => {
  const [roomEvents, setRoomEvents] = useState(ROOMEVENTS); //all other events taking place in room(s)
  const [availableRooms, setAvailableRooms] = useState(AVAILABLE_ROOMS);

  const [selectedRoom, setSelectedRoom] = useState("");

  const fetchRoomEvents = async (id, time) => {
    try {
      const response = await axios.get(API_URL + '/api/getEventsByRoom', { withCredentials: true}, {params: {
        roomId: id,
        time: time
      }})
      console.log("fetchRoomEvents()", response);
      setRoomEvents(response)
    } catch (error) {
      console.error("Error fetching RoomEvents: ", error);
    }
  }

  const fetchAvailableRooms = async (event) => {
    try {
      const response = await axios.get(API_URL + '/api/getAvailableRooms', { withCredentials: true}, {params: {
        timeMin: event.start.dateTime,
        timeMax: event.end.dateTime,
        excludeRooms: [event.conflicts.map((room) => (room.roomId))],
      }})
      console.log("fetchAvailableRooms()", response);
      setAvailableRooms(response);
    } catch (error) {
      console.error("Error fetching RoomEvents: ", error);
    }
  }

  useEffect(() => {
    fetchRoomEvents(roomId, pendingEvent.start.dateTime);
    fetchAvailableRooms(pendingEvent);
  }, [pendingEvent, roomId])

  return (
    <div>
      <div className="d-flex gap-2">
        <SideBySideEvents approvedEvents={roomEvents[0]} pendingEvents={roomEvents[1]} conflictId={conflictId}/>
        {selectedRoom ? 
          // If a room has been selected, display it in a new side-by-side viewer & add the pending event to the list of pending events attatched to new room
          <SideBySideEvents approvedEvents={availableRooms[selectedRoom].approvedEvents} pendingEvents={[...availableRooms[selectedRoom].pendingEvents, pendingEvent]} conflictId={conflictId}/>
          : null
        }
      </div>
      
      {/* <ConflictTimeline events={roomEvents} availableRooms={exampleRooms} selectedRoom={selectedRoom}/> */}
      <RoomSelector roomList={Object.keys(availableRooms)} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
    </div>
  )
}

export default ConflictEditor