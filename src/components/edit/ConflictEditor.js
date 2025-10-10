import React, { useState, useEffect, Fragment } from "react";
import axios from 'axios';
import API_URL from "../../config";
import { getRoomNameByCalendarID } from "../../util/util";
import { formatEventDates } from "../../util/util";
import RoomSelector from "./RoomSelector";
import SideBySideEvents from "./SideBySideEvents";
import RoomTimeline from "./RoomTimeline";
import { Button, ModalBody, ModalFooter } from "reactstrap";
import { useRooms } from "../../context/RoomsContext";


/**
 * 
 * @param {Object} pendingEvent the pending event that is in conflict with some other event 
 */
const ConflictEditor = ({ pendingEvent, conflictId, roomId, handleSubmitChanges, toggle }) => {
  const { rooms } = useRooms();
  const [roomEvents, setRoomEvents] = useState([[], []]); //all other events taking place in room(s)
  const [availableRooms, setAvailableRooms] = useState([]);

  const [selectedRoom, setSelectedRoom] = useState("");
  const [timeHasBeenChanged, setTimeHasBeenChanged] = useState(false);
  const [pendingEventCopy, setpendingEventCopy] = useState(pendingEvent);

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
      setRoomEvents([[], []]); // Reset to empty arrays on error
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
      console.log("fetchAvailableRooms()", response.data);
      setAvailableRooms(response.data);
    } catch (error) {
      console.error("Error fetching AvailableRoomEvents: ", error);
    }
  }

  useEffect(() => {
    if(rooms && rooms.rooms) {
      // If rooms are available, set the initial selected room to the one in the pending event
      setAvailableRooms(rooms.rooms); // Reset available rooms when pending event changes
    }
  }, [rooms]);

  useEffect(() => {
    fetchRoomEvents(roomId, pendingEvent.start.dateTime);
    fetchAvailableRooms(pendingEvent);
  }, [pendingEvent, roomId])

  useEffect(() => {
    if (selectedRoom) {
      console.log(selectedRoom, availableRooms[selectedRoom]);
    }
  }, [selectedRoom])

  return (
    <Fragment>
      <ModalBody className='px-3'>
        <div>
          <div className="d-flex gap-2">
            {roomEvents.length > 0 && roomEvents[0].length > 0 ? //Conditionally render the side-by-side events viewer if there are room events
              <SideBySideEvents approvedEvents={roomEvents[0]} pendingEvents={[pendingEventCopy, ...roomEvents[1].filter((e) => e.id !== conflictId)]} conflictId={conflictId} roomName={getRoomNameByCalendarID(roomId, rooms)}/>
              : <p className="text-muted">Loading room events...</p>
            }
            {selectedRoom && availableRooms[selectedRoom] ?
              // If a room has been selected, display it in a new side-by-side viewer & add the pending event to the list of pending events attatched to new room
              <SideBySideEvents approvedEvents={availableRooms[selectedRoom].approvedEvents} pendingEvents={[pendingEventCopy, ...availableRooms[selectedRoom].pendingEvents]} conflictId={conflictId} roomName={selectedRoom}/>
              : null
            }
          </div>

          <RoomTimeline timeRange={pendingEventCopy} setTimeRange={setpendingEventCopy} timeHasBeenChanged={timeHasBeenChanged} setTimeHasBeenChanged={setTimeHasBeenChanged} />

          {/* Display Room name and Time + updated Room names and Times (if changed) */}
          <div>
            <p><span className="text-danger">{getRoomNameByCalendarID(roomId, rooms)}</span> {selectedRoom ? <span className="text-primary"> &gt; {selectedRoom}</span> : null}</p>
            <p className="d-inline">{formatEventDates(pendingEvent.start.dateTime, pendingEvent.end.dateTime)}
              {timeHasBeenChanged ? <span> &gt; {pendingEventCopy}</span> : null}
            </p>
          </div>

          {/* <ConflictTimeline events={roomEvents} availableRooms={exampleRooms} selectedRoom={selectedRoom}/> */}
          <RoomSelector roomList={Object.keys(availableRooms)} selectedRoom={selectedRoom} setSelectedRoom={setSelectedRoom} />
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={(e) => handleSubmitChanges(roomId, selectedRoom, pendingEventCopy, pendingEvent)}>
          Submit Changes
        </Button>{' '}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Fragment>
  )
}

export default ConflictEditor