import React from "react"
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function DateTime({ startDateTime, endDateTime, handleStartDateTimeChange, handleEndDateTimeChange, minEndDateTime }) {
  return (
    <div className="date-time d-flex justify-content-between">
      {/* Start Date/Time */}
      <div className="mb-3">
        <label className="form-label">Start Time</label><br />
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
        <label className="form-label">End Time</label><br />
        <DatePicker
          selected={endDateTime}
          onChange={handleEndDateTimeChange}
          showTimeSelect
          timeIntervals={30}
          dateFormat="MMMM d, yyyy h:mm aa"
          className="form-control"
          minDate={minEndDateTime}
          minTime={new Date(new Date(minEndDateTime).setHours(0, 0, 0, 0))}
          maxTime={new Date(new Date(minEndDateTime).setHours(23, 59, 59, 999))}
        />
      </div>
    </div>
  );
}

export default DateTime;
