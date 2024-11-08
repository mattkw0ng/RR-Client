import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

function RecurrenceForm({ setRRULE }) {
  const [frequency, setFrequency] = useState('');
  const [interval, setInterval] = useState(1);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [endAfterOccurrences, setEndAfterOccurrences] = useState(null);
  const [endDate, setEndDate] = useState('');

  const weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];

  // Handlers
  const handleFrequencyChange = (e) => setFrequency(e.target.value);
  const handleIntervalChange = (e) => setInterval(e.target.value);
  const handleDayToggle = (day) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const handleEndAfterOccurrencesChange = (e) => setEndAfterOccurrences(e.target.value);
  const handleEndDateChange = (e) => setEndDate(e.target.value);

  // Generate RRULE
  const generateRecurrenceRule = () => {
    let rrule = `FREQ=${frequency.toUpperCase()}`;

    if (interval > 1) rrule += `;INTERVAL=${interval}`;

    if (frequency === 'weekly' && daysOfWeek.length > 0) {
      rrule += `;BYDAY=${daysOfWeek.join(',')}`;
    }

    if (endAfterOccurrences) {
      rrule += `;COUNT=${endAfterOccurrences}`;
    } else if (endDate) {
      rrule += `;UNTIL=${new Date(endDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
    }

    return rrule;
  };

  useEffect(() => {
    let rrule = `FREQ=${frequency.toUpperCase()}`;

    if (interval > 1) rrule += `;INTERVAL=${interval}`;

    if (frequency === 'weekly' && daysOfWeek.length > 0) {
      rrule += `;BYDAY=${daysOfWeek.join(',')}`;
    }

    if (endAfterOccurrences) {
      rrule += `;COUNT=${endAfterOccurrences}`;
    } else if (endDate) {
      rrule += `;UNTIL=${new Date(endDate).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
    }

    setRRULE(rrule);
  }, [frequency, interval, daysOfWeek, endAfterOccurrences, endDate, setRRULE])

  return (
    <div className="container my-4">
      <h3 className="mb-3">Set Recurrence Options</h3>

      <div className='d-flex justify-content-start'>
        {/* Frequency Selection */}
        <div className="form-group mb-3">
          <label htmlFor="frequencySelect">Frequency</label>
          <select
            id="frequencySelect"
            className="form-select"
            value={frequency}
            onChange={handleFrequencyChange}
          >
            <option value="">Select...</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>

        {/* Interval */}
        <div className="form-group mb-3 mx-5">
          <label>Repeat every</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              value={interval}
              min="1"
              onChange={handleIntervalChange}
            />
            <span className="input-group-text">
              {frequency && ` ${frequency.charAt(0).toUpperCase() + frequency.slice(1)}`}
            </span>
          </div>
        </div>

      </div>

      {/* Weekly Options */}
      {frequency === 'weekly' && (
        <div className="form-group mb-3">
          <label>Repeat on</label>
          <div className="d-flex flex-wrap">
            {weekdays.map((day) => (
              <div className="form-check me-2" key={day}>
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={daysOfWeek.includes(day)}
                  onChange={() => handleDayToggle(day)}
                  id={`day-${day}`}
                />
                <label className="form-check-label" htmlFor={`day-${day}`}>
                  {day}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* End Options */}
      <div className="form-group mb-3">
        <h5>End</h5>
        <div className='d-flex justify-content-start'>
          <div>
            <label>After __ occurrences</label>
            <input
              type="number"
              className="form-control mb-2"
              value={endAfterOccurrences || ''}
              min="1"
              onChange={handleEndAfterOccurrencesChange}
              placeholder="number of occurrences"
            />
          </div>

          <h5 className="text-center my-4 mx-5">or</h5>

          <div>
            <label>On date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
        </div>
      </div>

      {/* Generated RRULE */}
      <div className="mt-4">
        <p><strong>Generated RRULE:</strong> {generateRecurrenceRule()}</p>
      </div>
    </div>
  );
}

export default RecurrenceForm;
