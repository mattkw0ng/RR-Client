import React from "react";
import { Badge } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css"; // Make sure Bootstrap is included
import "./RoomSelector.css"

const RoomSelector = ({ roomList, selectedRoom, setSelectedRoom }) => {
  return (
    <div className="room-selector d-flex flex-wrap gap-2">
      <span className="fst-italic text-secondary">suggested</span>
      {roomList.map((room) => (
        <Badge
          key={room}
          className={`room-badge ${selectedRoom === room ? "selected" : ""}`}
          color={selectedRoom === room ? "primary" : "secondary"}
          pill
          onClick={() => setSelectedRoom(room === selectedRoom ? null : room)}
          style={{ cursor: "pointer" }}
        >
          {room}
        </Badge>
      ))}
    </div>
  );
};

export default RoomSelector;
