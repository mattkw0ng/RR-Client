import React from 'react';
import axios from 'axios';

const RoomButton = () => {
  const fetchRooms = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/rooms');
      console.log(response.data);
    } catch (error) {
      console.error('Error fetching rooms:', error);
    }
  };

  return (
    <div>
      <button className='btn btn-secondary' onClick={fetchRooms}>Fetch Rooms</button>
    </div>
  );
};

export default RoomButton;
