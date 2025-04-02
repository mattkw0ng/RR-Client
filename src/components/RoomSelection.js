import React, { useState } from 'react';
// import { roomsGrouped } from '../data/rooms';
import SelectedRoomsBar from './SelectedRoomsBar';
import Lightbox from './lightbox/RoomLightbox';
import { useRooms } from '../context/RoomsContext';

/**
 * @description Provides the list of rooms as selectable cards. Used in : @see RoomSearch
 * @param {Array} availableRooms : List of rooms that are available (given capacity and date/time)
 * @param {Array} filteredRooms : List of filtered rooms from the search bar
 * @param {Array} selectedRooms : List of selected rooms
 * @param {function} setSelectedRooms : Set state method for @see selectedRooms
 * @param {function} handleCheckout : Handle 'Checkout' AKA redirect to @see RoomReservation page, with state variables (preLoadRooms, preLoadData)
 * @param {boolean} verified : If the checkAvailability function has been called to verify which rooms are available at some time
 * @returns A view of all available/filtered rooms as selectable cards @see SelectedRoomsBar @see RoomLightbox
 */
function RoomSelection({ availableRooms, filteredRooms, selectedRooms, setSelectedRooms, handleCheckout, verified }) {
  const { rooms } = useRooms();
  const [isLightboxOpen, setLightboxOpen] = useState(false);
  const [displayRoom, setDisplayRoom] = useState("Sanctuary");

  const handleCardClick = (room) => {
    setDisplayRoom(room);
    setLightboxOpen(true);
  };

  // Toggle room selection
  const handleRoomToggle = (e, room) => {
    e.stopPropagation();
    if (selectedRooms.includes(room)) {
      setSelectedRooms(selectedRooms.filter(r => r !== room));
    } else {
      setSelectedRooms([...selectedRooms, room]);
    }
  };

  return (
    <div className={`room-selection p-5 room-selection-${verified}`}>

      <SelectedRoomsBar selectedRooms={selectedRooms} handleCheckout={handleCheckout} />

      {/* Display Room Cards */}
      {rooms && rooms.roomsGrouped ? Object.keys(rooms.roomsGrouped).map((building) => (
        rooms.roomsGrouped[building].some(elem => filteredRooms.includes(elem)) ?
          <div key={building} className='building-group w-100'>

            {/* Building Group Name */}
            <div className='d-flex justify-content-between'>
              <div className='w-100'>
                <hr />
              </div>
              <p className='text-italic building-label'>{building}</p>
            </div>

            {/* Room Card List */}
            <div className="room-cards d-flex flex-row flex-wrap">
              {rooms.roomsGrouped[building].map((room) => (
                filteredRooms.includes(room) ?
                  <div
                    key={room}
                    className={`room-card ${selectedRooms.includes(room) ? 'selected' : ''} ${availableRooms.includes(room) ? verified ? 'room-available' : 'room-pending' : 'room-unavailable'}`}
                    onClick={() => handleCardClick(room)}
                  >
                    {/* Room Card */}
                    <h5 className='mb-0'>{room}</h5>
                    <hr className='my-2'></hr>
                    <div className='d-flex justify-content-between'>
                      <p>{availableRooms.includes(room) ? verified ? "Available" : "check availability" : "Unavailable"}</p>
                      <button onClick={(e) => handleRoomToggle(e, room)} disabled={!availableRooms.includes(room)} className={selectedRooms.includes(room) ? 'btn btn-secondary' : (availableRooms.includes(room) ? 'btn btn-outline-primary' : 'btn btn-outline-danger')}>{selectedRooms.includes(room) ? "-" : "+"}</button>
                    </div>
                  </div>
                  :
                  null
              ))}
            </div>
          </div>
          : null
      )) : null}

      <Lightbox
        room={displayRoom}
        isOpen={isLightboxOpen}
        onClose={() => setLightboxOpen(false)}
        selectedRooms={selectedRooms}
        handleRoomToggle={handleRoomToggle}
      />

    </div>
  );
};

export default RoomSelection;
