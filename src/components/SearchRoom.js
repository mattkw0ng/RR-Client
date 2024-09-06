import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import API_URL from '../config';

const SearchRoom = () => {
  const [capacity, setCapacity] = useState('');
  const [resources, setResources] = useState('');
  const [rooms, setRooms] = useState([]);

  const searchRooms = async () => {
    try {
      const response = await axios.post(API_URL + '/api/searchRoomBasic', {
        capacity: parseInt(capacity),
        resources: resources.split(',').map(resource => resource.trim()),
      });
      setRooms(response.data);
    } catch (error) {
      console.error('Error searching rooms:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Search Rooms</h1>
      <div className="row">
        <div className="col-md-6 mb-3">
          <label htmlFor="capacity" className="form-label">Capacity</label>
          <input
            type="number"
            id="capacity"
            className="form-control"
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            placeholder="Enter capacity"
          />
        </div>
        <div className="col-md-6 mb-3">
          <label htmlFor="resources" className="form-label">Resources (comma separated)</label>
          <input
            type="text"
            id="resources"
            className="form-control"
            value={resources}
            onChange={(e) => setResources(e.target.value)}
            placeholder="Enter resources"
          />
        </div>
      </div>
      <button className="btn btn-primary" onClick={searchRooms}>Search</button>
      <div className="mt-4">
        {rooms.length > 0 && (
          <ul className="list-group">
            {rooms.map((room) => (
              <li key={room.room_name} className="list-group-item">
                <strong>{room.room_name}</strong> - Capacity: {room.capacity} - Resources: {room.resources.join(', ')}
              </li>
            ))}
          </ul>
        )}
        {rooms.length === 0 && (
          <p className="mt-3">No rooms found matching the criteria.</p>
        )}
      </div>
    </div>
  );
};

export default SearchRoom;
