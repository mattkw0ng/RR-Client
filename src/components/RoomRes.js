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
  const [minEndDateTime, setMinEndDateTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // Minimum end time 1 hour after start
  const [selectedRooms, setSelectedRooms] = useState([]); // Default room selection
  const [user, setUser] = useState(null);
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
  const [availableRooms, setAvailableRooms] = useState(rooms);
  const [switchCalendar, setSwitchCalendar] = useState(true);

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
      setAvailableRooms(response.data)
    } catch (error) {
      console.error('Error checking availability', error);
      alert('Error checking availability');
    }
  };

  const approvedCalendarId = "c_8f9a221bd12882ccda21c5fb81effbad778854cc940c855b25086414babb1079%40group.calendar.google.com"
  const separatedIframeSrc = "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&bgcolor=%23ffffff&src=Y18xODhkaWxtdmJvcGltZ2lyaGZqbWNwZG8xanNoaUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODgzNWczMW8yOTV1aWg0aXY0MHFncGw5bXNrdUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhiNnViZG84c2VhaWxkazRmMmxlMjNvNDl1a0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODg0OGlqMnNhYnBxaXMwbGwzc3FnM3M5NWl2c0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhlNWV1aG1pNG5tamVuZzZua2wzNG8yMmZxOEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhlYXF0ZWgzcmp1ZzlybWFxamZuMzJuY2VnNEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODgyNjh2MXZpNDN1ZzBlaTJibGZuYzhnMXBzMEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhlZjg1bWp1cDhpaDMwaXZvam05YjFxYnJsMkByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODgwMHNnYWtsMW5xaG85aHZtamtiazc4OW43MEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhmbHRpbzMxMDZvZ3J0Z2x1ajV0ZThydmZtZ0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODg3NTZrY2xjZDZhaHRoaTRzcWJwNjczc2g1b0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhmY2Y4aTNwNW5panU0azJhNmY2ZnZhZWhwMEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhiYzRoZTZjbHUwZ3BsamYxM2dnYWhkN3Y3aUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhhdWtsYjM4cHZjajR1aG42amVxazVmb3Bya0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODg4Z2I4ZmdxdmRjaWo2ajloMnU5MGhhdGs5ZUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhkODdjdmtqYjg2aGw3aGl0ZTQ1cnBwOWQ4dUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhkNnBrdWNhMTJranI2bW11bDJibGlwYWM5c0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhkMnNyY2lzY21tam43ajVlN2htMmxobzF2Z0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhhM29nb251cDNjaXQxa2ExNTJ0Y2F1bjBiY0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODg3NjhmdHM0aG9taGtzaGx0NzlvcWVmNmkyZUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhjOWdrOGRlMzVxam9za2V1Z3RtYWhpZGZoa0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&color=%23E67C73&color=%23B39DDB&color=%23E4C441&color=%23D50000&color=%23795548&color=%23E4C441&color=%23009688&color=%23F09300&color=%23D81B60&color=%23F4511E&color=%23EF6C00&color=%23E67C73&color=%234285F4&color=%237CB342&color=%23C0CA33&color=%23EF6C00&color=%23D50000&color=%237CB342&color=%23E4C441&color=%23C0CA33&color=%23B39DDB"
  const iframeSrc = `https://calendar.google.com/calendar/embed?src=${approvedCalendarId}&ctz=America%2FLos_Angeles`;
  

  return (
    <div className="container">

      <h1 className="my-4">Room Reservation System</h1>
      <button onClick={() => setSwitchCalendar(!switchCalendar)} className='btn btn-secondary'>{switchCalendar ? 'View Individual Calendars' : 'View All'}</button>
      <br />
      <iframe src={switchCalendar ? iframeSrc : separatedIframeSrc} title="ApprovedCalendar" style={{ border: 0 }} width="800" height="600" frameborder="0" ></iframe>
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
          {availableRooms.map((room) => (
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
