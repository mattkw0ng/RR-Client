import React, { useState, useEffect } from "react";
import axios from 'axios';
import API_URL from "../../config";
// import ConflictTimeline from "./ConflictTimeline";
import { AVAILABLE_ROOMS, ROOMEVENTS } from "../../data/example";
import { ROOMS } from "../../data/rooms";
import {formatDisplayTime} from "../../util/util";
import RoomSelector from "./RoomSelector";
import SideBySideEvents from "./SideBySideEvents";
import RoomTimeline from "./RoomTimeline";


/**
 * 
 * @param {Object} pendingEvent the pending event that is in conflict with some other event 
 */
const ConflictEditor = ({ approvedEvents, pendingEvent, conflictId, roomId }) => {
  const [roomEvents, setRoomEvents] = useState(ROOMEVENTS); //all other events taking place in room(s)
  const [availableRooms, setAvailableRooms] = useState(AVAILABLE_ROOMS);

  const [selectedRoom, setSelectedRoom] = useState("");
  const [timeHasBeenChanged, setTimeHasBeenChanged] = useState(false);
  const [pendingEventCopy, setpendingEventCopy] = useState(pendingEvent);

  function getRoomNameByCalendarID(calendarID) {
    for (const [roomName, roomData] of Object.entries(ROOMS)) {
      if (roomData.calendarID === calendarID) {
        return roomName;
      }
    }
    return null; // Return null if no matching calendarID is found
  }

  // const handleSliderChange = (newTimeRange) => {
  //   setpendingEventCopy(newTimeRange);
  // };


  const fetchRoomEvents = async (id, time) => {
    try {
      const response = await axios.get(API_URL + '/api/getEventsByRoom', {
        withCredentials: true, params: {
          roomId: id,
          time: time
        }
      })
      console.log("fetchRoomEvents()", response);
      setRoomEvents(response.data)
    } catch (error) {
      console.error("Error fetching RoomEvents: ", error);
    }
  }

  const fetchAvailableRooms = async (event) => {
    try {
      const response = await axios.get(API_URL + '/api/getAvailableRooms', {
        withCredentials: true, params: {
          timeMin: event.start.dateTime,
          timeMax: event.end.dateTime,
          excludeRooms: event.conflicts.map((room) => (room.roomId)),
        }
      })
      console.log("fetchAvailableRooms()", response);
      setAvailableRooms(response.data);
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
        <SideBySideEvents approvedEvents={roomEvents[0]} pendingEvents={[...roomEvents[1], pendingEventCopy]} conflictId={conflictId} />
        {selectedRoom ?
          // If a room has been selected, display it in a new side-by-side viewer & add the pending event to the list of pending events attatched to new room
          <SideBySideEvents approvedEvents={availableRooms[selectedRoom].approvedEvents} pendingEvents={[...availableRooms[selectedRoom].pendingEvents, pendingEvent]} conflictId={conflictId} />
          : null
        }
      </div>

      <RoomTimeline timeRange={pendingEventCopy} setTimeRange={setpendingEventCopy} setTimeHasBeenChanged={setTimeHasBeenChanged} />

      {/* Display Room name and Time + updated Room names and Times (if changed) */}
      <div>
        <p><span className="text-danger">{getRoomNameByCalendarID(roomId)}</span> {selectedRoom ? <span className="text-primary"> &gt; {selectedRoom}</span> : null}</p>
        <p className="d-inline">{formatDisplayTime(pendingEvent.start.dateTime)} - {formatDisplayTime(pendingEvent.end.dateTime)}
          {timeHasBeenChanged ? <span> &gt; {pendingEventCopy}</span> : null}
        </p>
      </div>

      {/* <ConflictTimeline events={roomEvents} availableRooms={exampleRooms} selectedRoom={selectedRoom}/> */}
      <RoomSelector roomList={Object.keys(availableRooms)} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
    </div>
  )
}

export default ConflictEditor