import React, { useState, useEffect, Fragment } from "react";
import { useNavigate } from 'react-router-dom';
import { roomListSimple } from "../../data/rooms";
import { formatTime } from "../../util/util";
import RoomSearchBar from "../RoomSearchBar";
import TimeRangeSlider from "../form/TimeRangeSlider";
import API_URL from "../../config";
import axios from 'axios';
import RoomSelection from "../RoomSelection";
import LoginModal from "../lightbox/LoginModal";
import { useAuth } from "../../context/AuthContext";

/**
 * @description '/search' page
 * @param {*} param0 
 * @returns A room filtering/searching form with a list of the resulting available rooms. Components: @see RoomSearchBar and @see RoomSelection components
 */

function RoomSearch() {
  const navigate = useNavigate();
  const { user, loading } = useAuth()
  
  const [roomName, setRoomName] = useState("");   // Search Query
  const [verifiedAvailability, setVerifiedAvailability] = useState(false)
  const [selectedRooms, setSelectedRooms] = useState([]);
  const [capacity, setCapacity] = useState("");
  const [resources, setResources] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  // Slider value state [startTime, endTime]
  const [timeRange, setTimeRange] = useState([20, 24]); // Default time: 8:00 AM - 4:00 PM (slider values)

  const [availableRooms, setAvailableRooms] = useState(roomListSimple);
  const [filteredRooms, setFilteredRooms] = useState(roomListSimple);

  // Handle Redirecting to next stem (Room Reservation Form Page)
  const handleProceedToReservation = () => {
    const startDateTime = convertToDateTimeUTC(date, startTime);
    const endDateTime = convertToDateTimeUTC(date, endTime);
    const preLoadData = {
      capacity,
      resources,
      startDateTime,
      endDateTime
    };
    const preLoadRooms = selectedRooms
    console.log("Moving to RoomReservation",selectedRooms,preLoadData)
    navigate("/room-reservation-form", { state: { preLoadRooms, preLoadData  } });
  };

  const availableCapacities = [325, 150, 15, 30, 20, 40, 25];
  const availableResources = [
    "Chairs",
    "TV",
    "Piano",
    "a/v sound system",
    "keyboard",
    "drums",
    "podium",
    "microphones",
    "folding tables"
  ];

  const handleResourceChange = (e) => {
    const value = e.target.value;
    setResources(
      resources.includes(value)
        ? resources.filter((res) => res !== value)
        : [...resources, value]
    );
  };

  const handleSliderChange = (newTimeRange) => {
    setTimeRange(newTimeRange);
  };

  const handleDateChange = (date) => {
    setDate(date);
  }

  useEffect(() => {
    setVerifiedAvailability(false);
  }, [timeRange, date])

  // Update the state variables startTime and endTime when timeRange finished updating (see above)
  useEffect(() => {
    setStartTime(formatTime(timeRange[0]));
    setEndTime(formatTime(timeRange[1]));
  }, [timeRange, setStartTime, setEndTime]);

  const convertToDateTimeUTC = (date, time) => {
    const dateTimeString = `${date} ${time}`;

    // Parse the local date and time first
    const localDateTime = new Date(dateTimeString);

    if (isNaN(localDateTime)) {
      throw new Error('Invalid Date or Time format');
    }

    return localDateTime.toUTCString();
  };

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare search criteria
    try {

      const startDateTime = convertToDateTimeUTC(date, startTime);
      const endDateTime = convertToDateTimeUTC(date, endTime);
      const searchCriteria = {
        capacity,
        resources,
        startDateTime,
        endDateTime
      };
      console.log(searchCriteria); // Pass the search criteria to the search handler
      const res = await axios.post(API_URL + '/api/filterRooms', searchCriteria);

      console.log('Available rooms', res.data);
      setAvailableRooms(res.data);
      setVerifiedAvailability(true);
    } catch (error) {
      console.error('Error adding event', error);
    }

  };

  const handleLoginRedirect = () => {
    navigate("/login", { state: { returnPath: "/", formData: {} } }); // Preserve form data
  };

  return (
    <Fragment>
      {/* Filters */}
      <div className="d-flex"> 
        <div className="form-filter-container d-flex bg-light">
          <form onSubmit={handleSubmit} id="form-filter" className="px-5 py-3">
            {/* Room Name Search */}
            <RoomSearchBar roomNames={roomListSimple} roomName={roomName} setRoomName={setRoomName} filteredRooms={filteredRooms} setFilteredRooms={setFilteredRooms} />
            <hr />
            <br />
            {/* Date and Time Selection */}
            <div className="mb-3">
              <label className="form-label">Select Date</label>
              <input
                type="date"
                className="form-control"
                value={date}
                onChange={(e) => handleDateChange(e.target.value)} />
            </div>
            {/* TimeRangeSlider */}
            <label className="form-label">Select Time Range</label>
            <TimeRangeSlider timeRange={timeRange} handleSliderChange={handleSliderChange}/>
            <hr />

            {/* Room Capacity Selection */}
            <div className="mb-3">
              <label className="form-label">Select Room Capacity</label>
              <select
                className="form-select"
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              >
                <option value="">Any Capacity</option>
                {availableCapacities.map((cap) => (
                  <option key={cap} value={cap}>
                    {cap}
                  </option>
                ))}
              </select>
            </div>

            {/* Room Resources Selection */}
            <div className="mb-3">
              <label className="form-label">Select Room Resources</label>
              {availableResources.map((resource) => (
                <div key={resource} className="form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    value={resource}
                    id={resource}
                    onChange={handleResourceChange}
                    checked={resources.includes(resource)} />
                  <label className="form-check-label" htmlFor={resource}>
                    {resource}
                  </label>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>
      
        <div className="room-card-container w-100">
          <RoomSelection availableRooms={availableRooms} filteredRooms={filteredRooms} selectedRooms={selectedRooms} setSelectedRooms={setSelectedRooms} handleCheckout={handleProceedToReservation} verified={verifiedAvailability}/>
        </div>
      </div>

      <LoginModal showLoginPrompt={!loading && !user} handleLoginRedirect={handleLoginRedirect} />
    </Fragment>
  );
}

export default RoomSearch;
