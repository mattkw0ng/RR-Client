import React, { useState } from "react";
import { useRooms } from "../context/RoomsContext";

/**
 * Search Bar for /search page
 * @param { roomName, setRoomName, filteredRooms, setFilteredRooms} param
 * 
 */
const RoomSearchBar = ({ roomName, setRoomName, filteredRooms, setFilteredRooms }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const { rooms } = useRooms();

  // Handle input change
  const handleInputChange = (e) => {
    const input = e.target.value;
    setRoomName(input);

    if (input.length > 0) {
      const matchingRooms = rooms?.roomListSimple.filter((room) =>
        room.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredRooms(matchingRooms);
      setShowDropdown(true);
    } else {
      setFilteredRooms(rooms?.roomListSimple);
      setShowDropdown(false);
    }
  };

  // Handle room selection from the dropdown
  const handleRoomSelect = (room) => {
    setRoomName(room);
    setShowDropdown(false); // Close the dropdown after selection
  };

  return (
    <div className="position-relative">
      {/* Search Bar Input */}
      <label className="form-label">Select Room</label>
      <input
        type="text"
        className="form-control"
        placeholder="Search for a room"
        value={roomName}
        onChange={handleInputChange}
        onFocus={() => roomName.length > 0 && setShowDropdown(true)} // Show dropdown when focused if input is not empty
        onBlur={() => setTimeout(() => setShowDropdown(false), 200)} // Timeout to allow click on dropdown
      />

      {/* Dropdown */}
      {showDropdown && (
        <ul className="list-group position-absolute" style={{ width: "100%", zIndex: 1 }}>
          {filteredRooms.length > 0 ? (
            filteredRooms.map((room, index) => (
              <li
                key={index}
                className="list-group-item list-group-item-action"
                onClick={() => handleRoomSelect(room)}
              >
                {room}
              </li>
            ))
          ) : (
            <li className="list-group-item">No matches found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default RoomSearchBar;
