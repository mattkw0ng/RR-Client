import React from 'react';
import './Lightbox.css';


/**
 * @description Lightbox display for rooms. Displays a view of the calendar and room details (resources and capacity). Button to continue to checkout room on the next page (bypass multi-room selection) or add to 'cart'
 * @param {Object} room see ROOMS in /data/rooms
 * @param {boolean} isOpen controls display of lightbox
 * @param {functino} onClose close/hide lightbox 
 * @returns 
 */
const Lightbox = ({ room, isOpen, onClose, selectedRooms, handleRoomToggle, roomsList}) => {
  
  if (!isOpen || !room) return null;

  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <button className="lightbox-close" onClick={onClose}>×</button>
        
        <h2>{room}</h2>
        
        {/* Room Images */}
        {/* <div className="room-images">
          {room.images.map((image, index) => (
            <img key={index} src={image} alt={`Room ${index + 1}`} className="room-image" />
          ))}
        </div> */}
        
        {/* Room Calendar Embed */}
        <div className="room-calendar">
          <iframe
            src={`https://calendar.google.com/calendar/embed?src=${roomsList?.rooms[room].calendarID}`}
            style={{ width: '100%', height: '400px', border: 'none' }}
            title={`${roomsList?.rooms[room].name} Calendar`}
          ></iframe>
        </div>
        
        {/* Room Details */}
        <div className="room-details">
          <p><strong>Capacity:</strong> {roomsList?.rooms[room].capacity}</p>
          <p><strong>Resources:</strong> {roomsList?.rooms[room].resources.join(', ')}</p>
          <button className={selectedRooms.includes(room) ? 'btn btn-secondary' : 'btn btn-primary'} onClick={(e)=>handleRoomToggle(e, room)}>{selectedRooms.includes(room) ? "Remove" : "Add"}</button>
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
