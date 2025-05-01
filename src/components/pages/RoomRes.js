import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Collapse, Input, Label, FormGroup, Button, Modal, ModalBody, ModalFooter, ModalHeader, Table } from 'reactstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import DateTime from '../form/DateTime';
import API_URL from '../../config';
import { congregationOptions, roomListSimple } from '../../data/rooms';
import TextInput from '../form/TextInput';
import TextArea from '../form/TextArea';
import SelectInput from '../form/SelectInput';
import RecurrenceForm from '../form/RecurrenceForm';
import { formatEventDates, parseRRule, roundToNearestHalfHour } from '../../util/util';
import LoginModal from '../lightbox/LoginModal';
import { useRooms } from '../../context/RoomsContext';


// Room Reservation Page
function RoomRes({ isAdmin = false }) {
  const { user, loading } = useAuth();
  const { rooms } = useRooms();
  const preLoadLocation = useLocation();
  const navigate = useNavigate();
  const { preLoadRooms = [], preLoadData = {} } = preLoadLocation.state || {};

  const [rRule, setRRULE] = useState();
  const [formData, setFormData] = useState({
    eventName: "",
    location: "San Jose Christian Alliance Church",
    description: "",
    congregation: "",
    groupName: "",
    groupLeader: "",
    email: "",
    numPeople: preLoadData.capacity,
  });

  // Pre Loaded Data from RoomSearch page
  const [startDateTime, setStartDateTime] = useState(preLoadData.startDateTime ? new Date(preLoadData.startDateTime) : roundToNearestHalfHour(new Date()));
  const [endDateTime, setEndDateTime] = useState(preLoadData.endDateTime ? new Date(preLoadData.endDateTime) : roundToNearestHalfHour(new Date(new Date().getTime() + 60 * 60 * 1000))); // Initial end time 1 hour after start
  const [minEndDateTime, setMinEndDateTime] = useState(new Date(new Date().getTime() + 60 * 60 * 1000)); // Minimum end time 1 hour after start
  const [selectedRooms, setSelectedRooms] = useState(preLoadRooms ? preLoadRooms : []); // Default room selection

  useEffect(() => {
    if (!user) return; // Guard clause to prevent premature access
    console.log("User loaded:", user);
  }, [user]);

  const [availableRooms, setAvailableRooms] = useState(roomListSimple);

  useEffect(() => {
    if (rooms && Object.keys(rooms).length > 0) {
      console.log("RoomsData loaded:", rooms.roomListSimple, rooms.roomsGrouped, rooms.rooms);
      setAvailableRooms(rooms.roomListSimple);
    }
  }, [rooms])

  // const [switchCalendar, setSwitchCalendar] = useState(true);
  const [isRepeating, setIsRepeating] = useState(false);
  const [isSummaryVisible, setIsSummaryVisible] = useState(false); // Controls the summary modal
  const [conflicts, setConflicts] = useState([]); // Stores any detected conflicts


  if (loading) {
    return <div className='p-5'>Loading...</div>;
  }

  const handleLoginRedirect = () => {
    navigate("/login", { state: { returnPath: "/", formData } }); // Preserve form data
  };

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

  const handleSummary = async (e) => {
    e.preventDefault();

    // Check for conflicts before proceeding
    await checkForConflicts();

    // Show the summary modal
    setIsSummaryVisible(true);
  };

  const handleSubmit = async () => {
    try {
      let conflictMessage = ''
      if (conflicts.length > 0) {
        conflictMessage = prompt(`
            Warning: This event conflicts with other event(s) in the calendar. 
            You may proceed with the reservation, but understand that it has a higher risk of being denied/modified. 
            If you would like to provide a note or message to the office staff please do so here:
          `);
      }

      const start = startDateTime.toISOString();
      const end = endDateTime.toISOString();

      console.log(selectedRooms);
      console.log(user);

      const { eventName, location, description, congregation, groupName, groupLeader, numPeople, email } = formData;

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
        isAdmin,
        conflictMessage,
        otherEmail: email,
      });
      alert('Event added successfully');
      if (isAdmin) {
        // Reset Form Data and allow Admin to enter another reservation
        setFormData({
          eventName: "",
          location: "San Jose Christian Alliance Church",
          description: "",
          congregation: "",
          groupName: "",
          groupLeader: "",
          email: "",
          numPeople: 0,
        });

        window.location.href = '/admin/reserve';
      } else {
        window.location.href = '/profile';
      }
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

  const handleCheckboxChange = () => {
    setRRULE(null) // reset RRULE
    setIsRepeating(!isRepeating);
  };

  const checkAvailability = async (e) => {
    try {
      e.preventDefault();
      const start = startDateTime.toISOString();
      const end = endDateTime.toISOString();

      const response = await axios.get(API_URL + `/api/checkAvailability?startDateTime=${start}&endDateTime=${end}`, { withCredentials: true });
      console.log(`Available rooms: ${response.data.join(', ')}`);
      setAvailableRooms(response.data)
    } catch (error) {
      console.error('Error checking availability', error);
      alert('Error checking availability');
    }
  };

  const checkForConflicts = async () => {
    try {
      const start = startDateTime.toISOString();
      const end = endDateTime.toISOString();

      const response = await axios.get(`${API_URL}/api/checkConflicts?startDateTime=${start}&endDateTime=${end}&recurrence=${rRule}&roomList=${JSON.stringify(selectedRooms.map((room_name) => rooms?.rooms[room_name].calendarID))}`, { withCredentials: true });
      console.log(`checking for conflicts: ${response.data}`);
      setConflicts(response.data || []);
    } catch (error) {
      console.error("Error checking conflicts", error);
      alert("Could not check for conflicts. Please try again.");
    }
  };


  // const approvedCalendarId = "c_8f9a221bd12882ccda21c5fb81effbad778854cc940c855b25086414babb1079%40group.calendar.google.com"
  // const separatedIframeSrc = "https://calendar.google.com/calendar/embed?height=600&wkst=1&ctz=America%2FLos_Angeles&bgcolor=%23ffffff&src=Y18xODhkaWxtdmJvcGltZ2lyaGZqbWNwZG8xanNoaUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODgzNWczMW8yOTV1aWg0aXY0MHFncGw5bXNrdUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhiNnViZG84c2VhaWxkazRmMmxlMjNvNDl1a0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODg0OGlqMnNhYnBxaXMwbGwzc3FnM3M5NWl2c0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhlNWV1aG1pNG5tamVuZzZua2wzNG8yMmZxOEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhlYXF0ZWgzcmp1ZzlybWFxamZuMzJuY2VnNEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODgyNjh2MXZpNDN1ZzBlaTJibGZuYzhnMXBzMEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhlZjg1bWp1cDhpaDMwaXZvam05YjFxYnJsMkByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODgwMHNnYWtsMW5xaG85aHZtamtiazc4OW43MEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhmbHRpbzMxMDZvZ3J0Z2x1ajV0ZThydmZtZ0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODg3NTZrY2xjZDZhaHRoaTRzcWJwNjczc2g1b0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhmY2Y4aTNwNW5panU0azJhNmY2ZnZhZWhwMEByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhiYzRoZTZjbHUwZ3BsamYxM2dnYWhkN3Y3aUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhhdWtsYjM4cHZjajR1aG42amVxazVmb3Bya0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODg4Z2I4ZmdxdmRjaWo2ajloMnU5MGhhdGs5ZUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhkODdjdmtqYjg2aGw3aGl0ZTQ1cnBwOWQ4dUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhkNnBrdWNhMTJranI2bW11bDJibGlwYWM5c0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhkMnNyY2lzY21tam43ajVlN2htMmxobzF2Z0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhhM29nb251cDNjaXQxa2ExNTJ0Y2F1bjBiY0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODg3NjhmdHM0aG9taGtzaGx0NzlvcWVmNmkyZUByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&src=Y18xODhjOWdrOGRlMzVxam9za2V1Z3RtYWhpZGZoa0ByZXNvdXJjZS5jYWxlbmRhci5nb29nbGUuY29t&color=%23E67C73&color=%23B39DDB&color=%23E4C441&color=%23D50000&color=%23795548&color=%23E4C441&color=%23009688&color=%23F09300&color=%23D81B60&color=%23F4511E&color=%23EF6C00&color=%23E67C73&color=%234285F4&color=%237CB342&color=%23C0CA33&color=%23EF6C00&color=%23D50000&color=%237CB342&color=%23E4C441&color=%23C0CA33&color=%23B39DDB"
  // const iframeSrc = `https://calendar.google.com/calendar/embed?src=${approvedCalendarId}&ctz=America%2FLos_Angeles`;

  const SummaryModal = () => {
    return (
      <Modal size='lg' isOpen={isSummaryVisible} toggle={() => setIsSummaryVisible(!isSummaryVisible)}>
        <ModalHeader toggle={() => setIsSummaryVisible(false)}>Event Summary</ModalHeader>
        <ModalBody>
          <h5>Event Details</h5>
          <Table>
            <tbody>
              <tr>
                <td>Event Name:</td>
                <td>{formData.eventName}</td>
              </tr>
              <tr>
                <td>Location:</td>
                <td>{formData.location}</td>
              </tr>
              <tr>
                <td>Description:</td>
                <td>{formData.description}</td>
              </tr>
              <tr>
                <td>Start Time:</td>
                <td>{startDateTime.toLocaleString()}</td>
              </tr>
              <tr>
                <td>End Time:</td>
                <td>{endDateTime.toLocaleString()}</td>
              </tr>
              <tr>
                <td>Rooms:</td>
                <td>{selectedRooms.join(", ") || "None Selected"}</td>
              </tr>
              <tr>
                <td>Repeating:</td>
                <td>{isRepeating ? parseRRule(rRule) : "N/A"}</td>
              </tr>
            </tbody>
          </Table>

          {/* Display Conflicts */}
          {conflicts.length > 0 ? (
            <>
              <h5 className="text-danger">Conflicts Found</h5>
              {conflicts.map((conflict, index) => {
                const roomName = Object.keys(rooms?.rooms || {}).find(
                  (key) => rooms.rooms[key].calendarID === conflict.room
                );
                
                return (
                  <p key={index}>
                    {`${rooms?.rooms[conflict.room].room_name} is busy from: `}
                    {conflict.times.map((timeRange) => (`${formatEventDates(timeRange.start, timeRange.end)}`)).join(', ')}
                  </p>
                )
              })}
            </>
          ) : (
            <h5 className="text-primary">No Conflicts Found</h5>
          )}
          {isRepeating && <small className='text-italic text-danger'>** Note: Conflict detection for recurring events is currently under development and may not be accurate.</small>}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleSubmit}>
            Submit
          </Button>
          <Button color="secondary" onClick={() => setIsSummaryVisible(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>)
  }

  return (
    <div className="container">
      <div className='my-4'>
        <h1 className="mb-0">{isAdmin ? "Admin Room Reservation Form" : "Room Reservation Request Form"}</h1>
        <small className='text-italic'>{isAdmin ? "Reservations are added directly to the Approved Calendar" : "Reservations may take a few days to be approved"}</small>
      </div>

      {/* Room Request Form */}
      <form onSubmit={handleSubmit}>

        <div className='row'>
          {/* Main Form Elements (Left Column) */}
          <div className='col-md-6'>
            {/* Summary */}
            <TextInput label={"Event Name"} name={'eventName'} handleFormChange={handleFormChange} formData={formData} />

            <div className='d-flex justify-content-between'>
              {/* Congregation */}
              <SelectInput label={"Congregation"} name={'congregation'} handleFormChange={handleFormChange} formData={formData} options={congregationOptions} />

              {/* Number of People */}
              <TextInput label={"Number of People"} name={'numPeople'} handleFormChange={handleFormChange} formData={formData} type={'number'} />
            </div>

            {/* Group Name */}
            <TextInput label={"Group Name"} name={'groupName'} handleFormChange={handleFormChange} formData={formData} />


            {isAdmin ? <div className="mb-3">
              <label className="form-label">Email
                <small className='text-italic'> (optional for sending notifications)</small>
              </label>
              <input
                name='email'
                type='email'
                className="form-control"
                value={formData['email']}
                onChange={(e) => handleFormChange(e)}
              ></input>
            </div>
              : null}

            {/* Location */}
            <TextInput label={"Location"} name={'location'} handleFormChange={handleFormChange} formData={formData} />

            {/* Description */}
            <TextArea label={"Description"} name={'description'} handleFormChange={handleFormChange} formData={formData} />

            {/* Group Leader's Name */}
            <TextInput label={"Group Leader's Name"} labelSmallText={" (if different from requester's name)"} name={'groupLeader'} handleFormChange={handleFormChange} formData={formData} />

            {/* Start Date/Time */}
            <DateTime startDateTime={startDateTime} endDateTime={endDateTime} minEndDateTime={minEndDateTime} handleStartDateTimeChange={handleStartDateTimeChange} handleEndDateTimeChange={handleEndDateTimeChange} />

            {/* Recurrence */}
            {/* Checkbox for Advanced Options */}
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  checked={isRepeating}
                  onChange={handleCheckboxChange}
                />
                Repeating Event
              </Label>
            </FormGroup>

            {/* Advanced Options */}
            <Collapse isOpen={isRepeating}>
              <RecurrenceForm rRule={rRule} setRRULE={setRRULE} startDateTime={startDateTime} endDateTime={endDateTime} />
            </Collapse>

          </div>

          {/* Room List (Right Column) */}
          <div className="col-md-6 px-5">
            <div className="room-selection">
              {rooms && rooms.roomsGrouped ? Object.entries(rooms?.roomsGrouped).map(([building, roomsList], index) => (
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
                        />
                        <label className={`form-check-label`} htmlFor={room}>
                          {room}{" "}
                          {availableRooms.includes(room) ? (
                            <small className='text-primary'>available</small>
                          ) : (
                            <small className='text-danger '>unavailable</small>
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
              )) : null}
            </div>
            <button onClick={checkAvailability} className="btn btn-secondary">Check Availability</button>
          </div>

          {/* Submit */}
          <div>
            {/* {user ? <Button onClick={(e) => handleSummary(e)} className="my-3" color='primary'>Add Event</Button> : <a href="/login" className='btn btn-disabled'>Please Login</a>} */}
          </div>
          <Button onClick={(e) => handleSummary(e)} className="my-3" color='primary'>Add Event</Button>

        </div>


      </form>

      <SummaryModal />
      <LoginModal showLoginPrompt={loading || !user} handleLoginRedirect={handleLoginRedirect} />
    </div>
  );
}

export default RoomRes;
