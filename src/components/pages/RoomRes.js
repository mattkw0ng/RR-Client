import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateTime from '../form/DateTime';
// import RoomButton from '../RoomButton';
// import SearchRoom from '../SearchRoom';
import API_URL from '../../config';
import { roomsGrouped, roomListSimple } from '../../data/rooms';
import TextInput from '../form/TextInput';
import TextArea from '../form/TextArea';
import SelectInput from '../form/SelectInput';
import RecurrenceForm from '../form/RecurrenceForm';


// Room Reservation Page
function RoomRes() {
  const preLoadLocation = useLocation();
  const { preLoadRooms = [], preLoadData = {} } = preLoadLocation.state || {};

  const [rRule, setRRULE] = useState();
  const [formData, setFormData] = useState({
    eventName: "",
    location: "San Jose Christian Alliance Church",
    description: "",
    congregation: "",
    groupName: "",
    groupLeader: "",
    numPeople: preLoadData.capacity,
  });

  // Pre Loaded Data from RoomSearch page
  const [startDateTime, setStartDateTime] = useState(preLoadData.startDateTime ? new Date(preLoadData.startDateTime) : new Date());
  const [endDateTime, setEndDateTime] = useState(preLoadData.endDateTime ? new Date(preLoadData.endDateTime) : new Date(new Date().getTime() + 60 * 60 * 1000)); // Initial end time 1 hour after start
  const [minEndDateTime, setMinEndDateTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // Minimum end time 1 hour after start
  const [selectedRooms, setSelectedRooms] = useState(preLoadRooms ? preLoadRooms : []); // Default room selection

  const [user, setUser] = useState(null);
  const [availableRooms, setAvailableRooms] = useState(roomListSimple);
  const [switchCalendar, setSwitchCalendar] = useState(true);

  useEffect(() => {

    axios
      .get(API_URL + '/api/auth/user', { withCredentials: true })
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

      const { eventName, location, description, congregation, groupName, groupLeader, numPeople } = formData;

      await axios.post(API_URL + '/api/addEventWithRooms', {
        eventName,
        location,
        description,
        congregation,
        groupName,
        groupLeader,
        numPeople,
        startDateTime: start,
        endDateTime: end,
        rooms: selectedRooms, // Pass selected room to server
        userEmail: user.emails[0].value,
        rRule,

      });
      alert('Event added successfully');
    } catch (error) {
      console.error('Error adding event', error);
      alert('Error adding event', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }

  const checkAvailability = async (e) => {
    try {
      e.preventDefault();
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
  const congregationOptions = [
    "Cantonese Ministry / Fellowship",
    "English Ministry / Small Group",
    "Mandarin Ministry / Fellowship",
    "Children's Ministry",
    "Young Adult Ministry",
    "Youth Ministry",
    "Worship Ministry - CS",
    "Worship Ministry - ES",
    "Worship Ministry - MS",
    "Partnering Church",
    "Other"
  ];



  return (
    <div className="container">

      <h1 className="my-4">Room Reservation Request Form</h1>

      {/* Room Request Form */}
      <form onSubmit={handleSubmit}>

        <div className='row'>
          {/* Main Form Elements (Left Column) */}
          <div className='col-md-6'>
            {/* Summary */}
            <TextInput label={"Event Name"} name={'eventName'} handleFormChange={handleFormChange} formData={formData} />

            {/* Location */}
            <TextInput label={"Location"} name={'location'} handleFormChange={handleFormChange} formData={formData} />

            {/* Description */}
            <TextArea label={"Description"} name={'description'} handleFormChange={handleFormChange} formData={formData} />

            <div className='d-flex justify-content-between'>
              {/* Congregation */}
              <SelectInput label={"Congregation"} name={'congregation'} handleFormChange={handleFormChange} formData={formData} options={congregationOptions} />

              {/* Number of People */}
              <TextInput label={"Number of People"} name={'numPeople'} handleFormChange={handleFormChange} formData={formData} type={'number'} />
            </div>

            {/* Group Name */}
            <TextInput label={"Group Name"} name={'groupName'} handleFormChange={handleFormChange} formData={formData} />

            {/* Group Leader's Name */}
            <TextInput label={"Group Leader's Name (if different from requester's name)"} name={'groupLeader'} handleFormChange={handleFormChange} formData={formData} />
            
            {/* Start Date/Time */}
            <DateTime startDateTime={startDateTime} endDateTime={endDateTime} minEndDateTime={minEndDateTime} handleStartDateTimeChange={handleStartDateTimeChange} handleEndDateTimeChange={handleEndDateTimeChange} />

            {/* Recurrence */}

            <RecurrenceForm setRRULE={setRRULE}/>
          </div>

          {/* Room List (Right Column) */}
          <div className="col-md-6 px-5">
            <div className="room-selection">
              {Object.entries(roomsGrouped).map(([building, roomsList], index) => (
                <div key={building} className="mb-3">
                  {/* Room Group Header with Collapse for Mobile */}
                  <div className="d-md-none">
                    {/* Collapsible on mobile */}
                    <hr />
                    <button
                      className="building-header"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse${index}`}
                      aria-expanded="false"
                      aria-controls={`collapse${index}`}
                    >
                      <h5 className="d-inline">{building || "Main Building"}</h5>
                    </button>
                  </div>

                  {/* Non-collapsible on desktop (always expanded) */}
                  <div className="d-none d-md-block">
                    <h5>{building || "Main Building"}</h5>
                  </div>

                  {/* Collapsible Content */}
                  <div
                    className={`collapse ${index === 0 ? "show" : ""} d-md-none`}
                    id={`collapse${index}`}
                  >
                    {roomsList.map((room) => (
                      <div key={room} className="form-check m-2">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={room}
                          value={room}
                          checked={selectedRooms.includes(room)}
                          onChange={handleRoomChange}
                          disabled={!availableRooms.includes(room)}
                        />
                        <label className="form-check-label" htmlFor={room}>
                          {room}{" "}
                          {availableRooms.includes(room) ? (
                            ""
                          ) : (
                            <small>unavailable</small>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>

                  {/* Always expanded content for desktop view */}
                  <div className="d-none d-md-block">
                    {roomsList.map((room) => (
                      <div key={room} className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={room}
                          value={room}
                          checked={selectedRooms.includes(room)}
                          onChange={handleRoomChange}
                          disabled={!availableRooms.includes(room)}
                        />
                        <label className="form-check-label" htmlFor={room}>
                          {room}{" "}
                          {availableRooms.includes(room) ? (
                            ""
                          ) : (
                            <small>unavailable</small>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={checkAvailability} className="btn btn-secondary">Check Availability</button>
          </div>

          {/* Submit */}
          <div>
            {user ? <button type="submit" className="btn btn-primary my-3">Add Event</button> : <a href="/login" className='btn btn-disabled'>Please Login</a>}
          </div>

        </div>


      </form>

      <div class="responsive-iframe-container">
        <iframe src={switchCalendar ? iframeSrc : separatedIframeSrc} title="ApprovedCalendar" style={{ border: 0 }} width="800" height="600" frameborder="0" ></iframe>
      </div>
      <br />
      <button onClick={() => setSwitchCalendar(!switchCalendar)} className='btn btn-outline-secondary'>{switchCalendar ? 'View Individual Calendars' : 'View All'}</button>
      <br />

      {/* <br />
      <RoomButton />
      <br />
      <SearchRoom /> */}
    </div>
  );
}

export default RoomRes;
