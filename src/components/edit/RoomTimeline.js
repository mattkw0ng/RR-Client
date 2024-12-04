import React, { useState } from "react";
import Draggable from "react-draggable";
import "./RoomTimeline.css";

const RoomTimeline = () => {
  const initialRooms = [
    {
      id: "room1",
      name: "Room 1",
      events: [
        { id: "event1", name: "Event 1", grid: "room1", position: { x: 0, y: 50 } },
        { id: "event2", name: "Event 2", grid: "room1", position: { x: 0, y: 150 } },
      ],
    },
    {
      id: "room2",
      name: "Room 2",
      events: [
        { id: "event3", name: "Event 3", grid: "room2", position: { x: 0, y: 50 } },
        { id: "event4", name: "Event 4", grid: "room2", position: { x: 0, y: 150 } },
      ],
    },
    {
      id: "room3",
      name: "Room 3",
      events: [],
    },
  ];

  const [rooms, setRooms] = useState(initialRooms);
  const [draggingElement, setDraggingElement] = useState(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 }); // Track initial drag position
  const [deltaPosition, setDeltaPosition] = useState({ deltaX: 0, deltaY: 0 });
  const [previewPosition, setPreviewPosition] = useState(null); // Store position of preview element
  const [targetGrid, setTargetGrid] = useState(null); // Track which grid the element will be moved to

  const handleStart = (e, data, event) => {
    // Store the initial drag position when the drag starts
    setDragStartPos(event.position);
    setDraggingElement(event.id);
    setDeltaPosition({ deltaX: 0, deltaY: 0 }); // Reset delta position on drag start
    setPreviewPosition(event.position); // Initialize preview position
    setTargetGrid(event.grid); // Track the initial grid for preview
  };

  const handleDrag = (e, data) => {
    // Update delta position
    const deltaX = data.x - dragStartPos.x;

    // Calculate the target grid based on deltaX movement
    let newTargetGridIndex = rooms.findIndex((room) => room.id === targetGrid);

    if (Math.abs(deltaX) > 50) {
      // If deltaX exceeds 50px, we increment or decrement the grid index based on the direction of deltaX
      newTargetGridIndex = deltaX > 0 ? newTargetGridIndex + 1 : newTargetGridIndex - 1;
    }

    // Ensure the target grid index stays within bounds (0 to rooms.length - 1)
    newTargetGridIndex = Math.max(0, Math.min(newTargetGridIndex, rooms.length - 1));

    const newTargetGrid = rooms[newTargetGridIndex].id;

    // Set the target grid for the preview
    setPreviewPosition({ x: 0, y: data.y , grid: newTargetGrid}); // Preview position is reset to `y` with `x=0`
  };

  const handleStop = (e, data, event, currentRoomId) => {
    const deltaX = data.x - dragStartPos.x;
    const deltaY = data.y - dragStartPos.y;

    // If the element has moved more than 50px horizontally, snap it to a new grid
    if (Math.abs(deltaX) > 50) {
      let newTargetGridIndex = rooms.findIndex((room) => room.id === targetGrid);

      // Update target grid index based on the direction of deltaX
      newTargetGridIndex = deltaX > 0 ? newTargetGridIndex + 1 : newTargetGridIndex - 1;

      // Ensure the target grid index stays within bounds (0 to rooms.length - 1)
      newTargetGridIndex = Math.max(0, Math.min(newTargetGridIndex, rooms.length - 1));

      const targetRoom = rooms[newTargetGridIndex];
      const eventToMove = {
        ...event,
        grid: targetRoom.id,
        position: { x: 0, y: previewPosition.y }, // Use the preview `y` position and reset x to 0
      };

      setRooms((prevRooms) => {
        return prevRooms.map((room) => {
          if (room.id === currentRoomId) {
            // Remove the event from the current room
            return { ...room, events: room.events.filter((ev) => ev.id !== event.id) };
          } else if (room.id === targetRoom.id) {
            // Add the new event to the target room with x = 0
            return {
              ...room,
              events: [...room.events, eventToMove],
            };
          }
          return room;
        });
      });
    } else {
      // If deltaX is less than 50, allow vertical movement within the grid
      setRooms((prevRooms) => {
        return prevRooms.map((room) => {
          if (room.id === currentRoomId) {
            return {
              ...room,
              events: room.events.map((ev) =>
                ev.id === event.id
                  ? { ...ev, position: { x: ev.position.x, y: data.y } }
                  : ev
              ),
            };
          }
          return room;
        });
      });
    }

    setDeltaPosition({ deltaX, deltaY }); // Update delta position after the drop
    setDraggingElement(null); // Clear dragging state after drop
    setPreviewPosition(null); // Clear the preview position
  };

  return (
    <div className="room-timeline">
      {rooms.map((room) => (
        <div key={room.id} className="room-grid">
          <h4>{room.name}</h4>
          <div className="grid-bar">
            {room.events.map((event) => (
              <Draggable
                key={event.id}
                axis="both" // Allow both x and y axis movement
                position={event.position} // Preserve the current position
                onStart={(e, data) => handleStart(e, data, event)} // Track the start position
                onDrag={handleDrag} // Update preview during drag
                onStop={(e, data) => handleStop(e, data, event, room.id)} // Handle drop
              >
                <div className="event">{event.name}</div>
              </Draggable>
            ))}
            {/* Show preview only in the target grid */}
            {previewPosition?.grid === room.id && previewPosition && (
              <div
                className="preview"
                style={{
                  left: `${previewPosition.x}px`,
                  top: `${previewPosition.y}px`,
                  opacity: 0.5,
                  backgroundColor: "rgba(0, 123, 255, 0.3)", // Light blue transparent color for preview
                }}
              >
                Preview
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoomTimeline;
