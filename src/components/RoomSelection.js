import React, { useState } from 'react';

import { roomsGrouped } from '../data/rooms';

function RoomSelection({ availableRooms, filteredRooms }) {
  const [selectedRooms, setSelectedRooms] = useState([]);

  // Toggle room selection
  const handleRoomToggle = (room) => {
    if (selectedRooms.includes(room)) {
      setSelectedRooms(selectedRooms.filter(r => r !== room));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  const checkoutButton = <button className='btn btn-primary'>Checkout</button>

  return (
    <div className="room-selection p-5">
      {/* Display Search Query */}
      <div className='search-query-container'>
        <p className='text-italic'>Search results for "" on "" at ""</p>
      </div>

      {/* Display Selected Rooms */}
      <div className="selected-rooms">
        <h4>Selected Rooms:</h4>
        <div className='d-flex justify-content-between'>
          <ul className='list-group list-group-horizontal'>
            {selectedRooms.map((room) => (
              <li key={room} className='list-group-item'>{room}</li>
            ))}
          </ul>

          {selectedRooms.length > 0 ? checkoutButton : null}
        </div>
      </div>

      {/* Display Room Cards */}
      {Object.keys(roomsGrouped).map((building) => (
        <div key={building}>
          <h4>{building}</h4>
          <div className="room-cards d-flex flex-row">
            {roomsGrouped[building].map((room) => (
              filteredRooms.includes(room) ?
                <div
                  key={room}
                  className={`room-card ${selectedRooms.includes(room) ? 'selected' : ''} ${availableRooms.includes(room) ? 'room-available' : 'room-unavailable'}`}
                  onClick={() => handleRoomToggle(room)}
                >
                  <h5 className='mb-0'>{room}</h5>
                  <hr className='my-2'></hr>
                  <div className='d-flex justify-content-between'>
                    <p>{availableRooms.includes(room) ? "Available" : "Unavailable"}</p> {/* Replace with dynamic availability */}
                    <button disabled={!availableRooms.includes(room)} className={selectedRooms.includes(room) ? 'btn btn-secondary' : (availableRooms.includes(room) ? 'btn btn-outline-primary' : 'btn btn-outline-danger')}>{selectedRooms.includes(room) ? "-" : "+"}</button>
                  </div>
                </div>
                :
                null
            ))}
          </div>
          <hr />
        </div>
      ))}

    </div>
  );
};

export default RoomSelection;
