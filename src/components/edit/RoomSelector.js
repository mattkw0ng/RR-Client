import React from "react";
import { Badge } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure Bootstrap is included
import "./RoomSelector.css"

const RoomSelector = ({ roomList, selectedRoom, setSelectedRoom , multiple=false}) => {

  return (
    <div className="room-selector d-flex flex-wrap gap-2">
      {multiple ? null : <span className="fst-italic text-secondary">suggested</span>}
      
      {roomList.map((room) => (
        <Badge
          key={room}
          className={multiple ?
            `room-badge ${selectedRoom.includes(room) ? "selected" : ""}`
            :
            `room-badge ${selectedRoom === room ? "selected" : ""}`}
          color={multiple ?
            selectedRoom.includes(room) ? "primary" : "secondary"
            :
            selectedRoom === room ? "primary" : "secondary"}
          pill
          onClick={multiple ?
            () => setSelectedRoom(selectedRoom.includes(room) ? selectedRoom.filter((r) => r !== room) : [room, ...selectedRoom])
            :
            () => setSelectedRoom(room === selectedRoom ? null : room)}
          style={{ cursor: "pointer" }}
        >
          {room}
        </Badge>
      ))}
    </div>
  );
};

export default RoomSelector;
