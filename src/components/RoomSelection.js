import React, { useState } from 'react';

import { roomsGrouped } from '../data/rooms';

function RoomSelection ({availableRooms}) {
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Toggle room selection
  const handleRoomToggle = (room) => {
    if (selectedRooms.includes(room)) {
      setSelectedRooms(selectedRooms.filter(r => r !== room));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  return (
    <div className="room-selection p-5">
      {Object.keys(roomsGrouped).map((building) => (
        <div key={building}>
          <h4>{building}</h4>
          <div className="room-cards">
            {roomsGrouped[building].map((room) => (
              <div
                key={room}
                className={`room-card ${selectedRooms.includes(room) ? 'selected' : ''} ${availableRooms.includes(room) ? 'room-available' : 'room-unavailable'}`}
                onClick={() => handleRoomToggle(room)}
              >
                <h5 className='mb-0'>{room}</h5>
                <hr className='my-2'></hr>
                <div className='d-flex justify-content-between'>
                  <p>{availableRooms.includes(room) ? "Available" : "Unavailable"}</p> {/* Replace with dynamic availability */}
                  <button disabled={!availableRooms.includes(room)} className={selectedRooms.includes(room) ? 'btn btn-secondary' : 'btn btn-outline-primary'}>{selectedRooms.includes(room) ? "-" : "+"}</button>
                </div>
              </div>
            ))}
          </div>
          <hr />
        </div>
      ))}

      {/* Display Selected Rooms */}
      <div className="selected-rooms">
        <h4>Selected Rooms:</h4>
        <ul>
          {selectedRooms.map((room) => (
            <li key={room}>{room}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RoomSelection;
