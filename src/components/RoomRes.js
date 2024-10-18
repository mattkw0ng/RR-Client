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
  const [selectedRooms, setSelectedRooms] = useState([]); // Default room selection
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
    const { value, checked } = event.target;

    if (checked) {
      // Add room to the selectedRooms array
      setSelectedRooms([...selectedRooms, value]);
    } else {
      // Remove room from the selectedRooms array
      setSelectedRooms(selectedRooms.filter((room) => room !== value));
    }
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const start = startDateTime.toISOString();
      const end = endDateTime.toISOString();

      console.log(selectedRooms);

      await axios.post(API_URL + '/api/addEventWithRooms', {
        summary,
        location,
        description,
        startDateTime: start,
        endDateTime: end,
        rooms: selectedRooms, // Pass selected room to server
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

  const approvedCalendarId = "c_8f9a221bd12882ccda21c5fb81effbad778854cc940c855b25086414babb1079%40group.calendar.google.com"
  const iframeSrc = `https://calendar.google.com/calendar/embed?src=${approvedCalendarId}&ctz=America%2FLos_Angeles`;
  const rooms = [
    "Sanctuary",
    "Chapel",
    "A101",
    "A102",
    "A103/104",
    "A105",
    "A114/115",
    "A201",
    "B101/102",
    "B103/104",
    "B105",
    "C101/102",
    "C103/104",
    "C201/202",
    "C203/204",
    "D103 Conf. Rm"
  ];


  return (
    <div className="container">

      <h1 className="my-4">Room Reservation System</h1>
      <iframe src={iframeSrc} title="ApprovedCalendar" style={{ border: 0 }} width="800" height="600" frameborder="0" ></iframe>

      <h2 className="my-4">Room Request Form</h2>

      {/* Room Request Form */}
      <form onSubmit={handleSubmit}>
        {/* Summary */}
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

        {/* Location */}
        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            type="text"
            className="form-control"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
        </div>

        {/* Description */}
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>

        {/* Room Selection */}
        <div className="mb-3">
          <label className="form-label">Room</label>
          {rooms.map((room) => (
            <div key={room} className="form-check">
              <input
                type="checkbox"
                className="form-check-input"
                id={room}
                value={room}
                checked={selectedRooms.includes(room)} // To check if the room is selected
                onChange={handleRoomChange}
              />
              <label className="form-check-label" htmlFor={room}>
                {room}
              </label>
            </div>
          ))}
        </div>

        {/* Start Date/Time */}
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
        {/* End Date/Time */}
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

        {/* Submit */}
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
