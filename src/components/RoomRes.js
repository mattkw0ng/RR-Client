import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import RoomButton from './RoomButton';
import SearchRoom from './SearchRoom';
import API_URL from '../config';

// Room Reservation Page
function RoomRes() {
  const [summary, setSummary] = useState('');
  const [location, setLocation] = useState('San Jose Christian Alliance Church');
  const [description, setDescription] = useState('');
  const [startDateTime, setStartDateTime] = useState(new Date());
  const [endDateTime, setEndDateTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // Initial end time 1 hour after start
  const [events, setEvents] = useState([]);
  const [minEndDateTime, setMinEndDateTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // Minimum end time 1 hour after start
  const [selectedRoom, setSelectedRoom] = useState('Chapel'); // Default room selection
  const [user, setUser] = useState(null);

  useEffect(() => {
    axios
      .get(API_URL + '/auth/user', { withCredentials: true })
      .then((response) => {
        if (response.data.user) {
          setUser(response.data.user);
        } else {
          console.error('Not authenticated');
        }
      })
      .catch((err) => console.error(err));
  }, []);


  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(API_URL + '/api/upcomingEvents', { withCredentials: true });
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events', error);
        alert('Error fetching events');
      }
    };

    fetchEvents();
  }, []);

  const handleStartDateTimeChange = (date) => {
    setStartDateTime(date);
    const minEndTime = new Date(date.getTime() + 60 * 60 * 1000); // Minimum end time 1 hour after start
    setMinEndDateTime(minEndTime);

    if (endDateTime < minEndTime) {
      setEndDateTime(minEndTime);
    }
  };

  const handleEndDateTimeChange = (date) => {
    if (date >= minEndDateTime) {
      setEndDateTime(date);
    } else {
      setEndDateTime(minEndDateTime);
    }
  };

  const handleRoomChange = (event) => {
    setSelectedRoom(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const start = startDateTime.toISOString();
      const end = endDateTime.toISOString();

      await axios.post(API_URL + '/api/addEventWithRoom', {
        summary,
        location,
        description,
        startDateTime: start,
        endDateTime: end,
        room: selectedRoom, // Pass selected room to server
        userEmail: user.emails[0].value,
      });
      alert('Event added successfully');
    } catch (error) {
      console.error('Error adding event', error);
      alert('Error adding event', error);
    }
  };

  const checkAvailability = async () => {
    try {
      const start = startDateTime.toISOString();
      const end = endDateTime.toISOString();

      const response = await axios.get(API_URL + `/api/checkAvailability?startDateTime=${start}&endDateTime=${end}`, { withCredentials: true });
      alert(`Available rooms: ${response.data.join(', ')}`);
    } catch (error) {
      console.error('Error checking availability', error);
      alert('Error checking availability');
    }
  };

  return (
    <div className="container">
      <h1 className="my-4">Room Reservation System</h1>

      <h2 className="my-4">Upcoming Events</h2>
      <ul className="list-group mb-4">
        {events.length === 0 ? (
          <li className="list-group-item">No upcoming events found.</li>
        ) : (
          events.map((event) => (
            <li className="list-group-item" key={event.id}>
              <h5>{event.summary}</h5>
              <p>Location: {event.location || 'N/A'}</p>
              <p>Start: {new Date(event.start.dateTime || event.start.date).toLocaleString()}</p>
              <p>End: {new Date(event.end.dateTime || event.end.date).toLocaleString()}</p>
            </li>
          ))
        )}
      </ul>

      <h2 className="my-4">Add Event to Google Calendar</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Summary</label>
          <input
            type="text"
            className="form-control"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div className="mb-3">
          <label className="form-label">Room</label>
          <select
            className="form-control"
            value={selectedRoom}
            onChange={handleRoomChange}
          >
            <option value="Chapel">Chapel</option>
            <option value="Sanctuary">Sanctuary</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Start DateTime</label>
          <DatePicker
            selected={startDateTime}
            onChange={handleStartDateTimeChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="form-control"
          />
        </div>
        <div className="mb-3">
          <label className="form-label">End DateTime</label>
          <DatePicker
            selected={endDateTime}
            onChange={handleEndDateTimeChange}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={30}
            dateFormat="MMMM d, yyyy h:mm aa"
            className="form-control"
            minDate={minEndDateTime}
            minTime={new Date(minEndDateTime).setHours(0, 0, 0, 0)}
            maxTime={new Date(minEndDateTime).setHours(23, 59, 59, 999)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Event</button>
      </form>

      <button onClick={checkAvailability} className="btn btn-success mt-3">Check Availability</button>
      <br />
      <RoomButton />
      <br />
      <SearchRoom />
    </div>
  );
}

export default RoomRes;
