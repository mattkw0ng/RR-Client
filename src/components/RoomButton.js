import React from 'react';
import axios from 'axios';
import API_URL from '../config';

const RoomButton = () => {
  const fetchRooms = async () => {
    try {
      const response = await axios.get(API_URL + '/api/rooms', { withCredentials: true});
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
