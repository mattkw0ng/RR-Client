import React, { useState, useEffect } from "react";
import { roomListSimple } from "../data/rooms";
import RoomSearchBar from "./RoomSearchBar";
import TimeRangeSlider from "./form/TimeRangeSlider";
import API_URL from "../config";
import axios from 'axios';


const RoomSearch = ({ handleSearch }) => {
  const [roomName, setRoomName] = useState("");
  const [capacity, setCapacity] = useState("");
  const [resources, setResources] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().substring(0, 10));
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  // Slider value state [startTime, endTime]
  const [timeRange, setTimeRange] = useState([16, 32]); // Default time: 8:00 AM - 4:00 PM (slider values)

  // Convert slider value (0–47) to time in "hh:mm AM/PM" format
  const formatTime = (value) => {
    const hour = Math.floor(value / 2);
    const minute = value % 2 === 0 ? "00" : "30";
    const period = hour >= 12 ? "PM" : "AM";
    const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${formattedHour}:${minute} ${period}`;
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

  // Update the state variables startTime and endTime when timeRange finished updating (see above)
  useEffect(() => {
    setStartTime(formatTime(timeRange[0]));
    setEndTime(formatTime(timeRange[1]));
  }, [timeRange, setStartTime, setEndTime])

  const convertToDateTimeUTC = (date, time) => {
    const dateTimeString = `${date} ${time}`;
  
    // Parse the local date and time first
    const localDateTime = new Date(dateTimeString);

    if (isNaN(localDateTime)) {
      throw new Error('Invalid Date or Time format');
    }

    console.log("CombineDateTimeInUTC")
    console.log(dateTimeString)
    console.log(localDateTime)
    console.log(localDateTime.toUTCString())

    return localDateTime.toUTCString();
  }

  // Handle submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    // Prepare search criteria
    

    try {

      const startDateTime = convertToDateTimeUTC(date, startTime);
      const endDateTime = convertToDateTimeUTC(date, endTime);
      const searchCriteria = {
        roomName,
        capacity,
        resources,
        date,
        startDateTime,
        endDateTime
      };
      console.log(searchCriteria); // Pass the search criteria to the search handler
      const res = await axios.post(API_URL + '/api/filterRooms', searchCriteria);
      alert('Available rooms', res);
    } catch (error) {
      console.error('Error adding event', error);
    }
    
  };

  return (
    <form onSubmit={handleSubmit} className="px-5 py-3">

      {/* Room Name Search */}
      <RoomSearchBar roomNames={roomListSimple} roomName={roomName} setRoomName={setRoomName}/>
      <hr />
      <br />
      {/* Date and Time Selection */}
      <div className="mb-3">
        <label className="form-label">Select Date</label>
        <input
          type="date"
          className="form-control"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>
      {/* TimeRangeSlider */}
      <label className="form-label">Select Time Range</label>
      <TimeRangeSlider timeRange={timeRange} handleSliderChange={handleSliderChange} formatTime={formatTime} />
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
              checked={resources.includes(resource)}
            />
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
  );
};

export default RoomSearch;
