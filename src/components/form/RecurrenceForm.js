import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { getWeekdayIfSame, parseRRule } from '../../util/util';

function RecurrenceForm({ rRule, setRRULE, startDateTime, endDateTime }) {
  const [frequency, setFrequency] = useState('');
  const [interval, setInterval] = useState(1);
  const [bySetPos, setBySetPos] = useState([1]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [endAfterOccurrences, setEndAfterOccurrences] = useState(null);
  const [endDate, setEndDate] = useState('');
  const [exampleText, setExampleText] = useState('Select an option to see an example.');

  const weekdays = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'];
  const weekdayNames = {
    MO: 'Monday', TU: 'Tuesday', WE: 'Wednesday', TH: 'Thursday',
    FR: 'Friday', SA: 'Saturday', SU: 'Sunday'
  };

  // Handlers
  const handleFrequencyChange = (e) => {
    setFrequency(e.target.value);
  };
  const handleIntervalChange = (e) => setInterval(e.target.value);
  const handleDayToggle = (day) => {
    setDaysOfWeek((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };
  const handleEndAfterOccurrencesChange = (e) => {
    setEndAfterOccurrences(e.target.value);
    setEndDate('');
  };
  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
    setEndAfterOccurrences(null);
  };

  const handleBySetPos = (value) => {
    setBySetPos((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  useEffect(() => {
    setDaysOfWeek([getWeekdayIfSame(startDateTime, endDateTime)]);
  }, [startDateTime, endDateTime]);

  // **DYNAMIC EXAMPLES**
  useEffect(() => {
    const weekDayMap = {
      MO: 'Monday', TU: 'Tuesday', WE: 'Wednesday', TH: 'Thursday',
      FR: 'Friday', SA: 'Saturday', SU: 'Sunday'
    };

    if (!frequency) {
      setExampleText('Select an option to see an example.');
      return;
    }

    switch (frequency) {
      case 'daily':
        setExampleText(`Example: "Every ${interval > 1 ? `${interval} days` : "day"}"`);
        break;
      case 'weekly':
        setExampleText(
          `Example: "Every ${interval > 1 ? `${interval} weeks` : "week"} on ${daysOfWeek.length > 0 ? daysOfWeek.map(d => weekDayMap[d]).join(', ') : "selected days"}"`
        );
        break;
      case 'monthly':
        setExampleText(`Example: "Every ${interval > 1 ? interval + ' months' : 'month'} on the ${bySetPos.length > 0 ? bySetPos.map((i) => ["1st", "2nd", "3rd", "4th", "last"][i - 1]).join(" and ")
          : 'Nth'} ${daysOfWeek.length > 0 ? daysOfWeek.map(d => weekDayMap[d]).join(', ') : "selected days"}"`
        );
        break;
      default:
        setExampleText("Select a valid recurrence option.");
    }
  }, [frequency, interval, daysOfWeek, bySetPos]);

  useEffect(() => {
    // Generate RRULE
    let rrule = `FREQ=${frequency.toUpperCase()}`;
    if (interval > 1) rrule += `;INTERVAL=${interval}`;
    if (frequency === 'weekly' && daysOfWeek.length > 0) rrule += `;BYDAY=${daysOfWeek.join(',')}`;
    if (frequency === 'monthly' && daysOfWeek.length > 0) {
      rrule += `;BYSETPOS=${bySetPos.join(',')}`
      rrule += `;BYDAY=${daysOfWeek.join(',')}`
    }
    if (endAfterOccurrences) {
      rrule += `;COUNT=${endAfterOccurrences}`;
    } else if (endDate) {
      const untilDate = new Date(endDate);
      untilDate.setUTCHours(23, 59, 59, 999)
      rrule += `;UNTIL=${untilDate.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
    } else {
      // If no end date or occurrence count is provided, limit to 6 months from the start date
      const startDate = new Date(startDateTime);
      const sixMonthsLater = new Date(startDate);
      sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);
      sixMonthsLater.setUTCHours(23, 59, 59, 999);
      rrule += `;UNTIL=${sixMonthsLater.toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;
    }

    setRRULE(rrule);
  }, [frequency, interval, daysOfWeek, endAfterOccurrences, endDate, setRRULE, bySetPos, startDateTime]);

  return (
    <div className="container my-4 bg-light p-3 rounded">
      <div className="d-flex justify-content-start">
        {/* Frequency Selection */}
        <div className="form-group mb-3">
          <label htmlFor="frequencySelect">How often will the event repeat?</label>
          <select
            id="frequencySelect"
            className="form-select"
            value={frequency}
            onChange={handleFrequencyChange}
          >
            <option value="">Select...</option>
            <option value="daily">Daily (e.g., "Every day")</option>
            <option value="weekly">{`Weekly (e.g. "Every ${daysOfWeek.length > 0 ? daysOfWeek.map(d => weekdayNames[d]).join(', ') : "Sunday"}")`}</option>
            <option value="monthly">{`Monthly (e.g., "Every 1st ${daysOfWeek.length > 0 ? daysOfWeek.map(d => weekdayNames[d]).join(', ') : "Sunday"} of the month")`}</option>
          </select>
        </div>

        {/* Interval Selection */}
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
              {/* Format the frequency from monthly => Month(s) | weekly => Week(s) | daily => Day(s) */}
              {`${frequency ? frequency === "daily" ? "Day" : frequency.charAt(0).toUpperCase() + frequency.slice(1, -2) : "Day"}${(interval > 1) ? 's' : ''}`}
            </span>
          </div>
        </div>
      </div>

      {frequency === 'monthly' && (
        <div className="form-group mb-3">
          <label>{`Repeat Every:`}</label>
          <div className="d-flex flex-wrap">
            {['1st', '2nd', '3rd', '4th', 'last'].map((label, index) => (<div className="form-check me-2" key={'nth' + index}>
              <input
                className="form-check-input"
                type="checkbox"
                checked={bySetPos.includes(index + 1)}
                onChange={() => handleBySetPos(index + 1)}
                id={label}
              />
              <label className="form-check-label" htmlFor={label}>
                {label}
              </label>
            </div>))}
          </div>
        </div>
      )}

      {/* Weekly Options */}
      {(frequency === 'weekly' || frequency === 'monthly') && (
        <div className="form-group mb-3">
          <label>{frequency === 'monthly' ? 'Weekday:' : 'Repeat Every:'}</label>

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
                  {weekdayNames[day]}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      <small className="text-muted text-italic">{exampleText}</small>

      <hr />
      {/* End Options */}
      <div className="form-group mb-3">
        <p>When will the event end?</p>
        <div className="d-flex justify-content-start">
          {/*}
          <div>
            <label>Stop after</label>
            <div className="input-group">
              <input
                type="number"
                className="form-control"
                value={endAfterOccurrences || ''}
                min="1"
                onChange={handleEndAfterOccurrencesChange}
                placeholder="e.g. 10"
              />
              <span className="input-group-text">occurrences</span>
            </div>
          </div>

          <h5 className="text-center my-4 mx-5">or</h5>

          */}

          <div>
            <label>Stop on</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={handleEndDateChange}
              min={new Date().toISOString().split('T')[0]} // Today's date
              max={new Date(new Date().setMonth(new Date().getMonth() + 6)).toISOString().split('T')[0]} // 6 months from now
            />
          </div>
        </div>
      </div>
      <small className='text-italic'>{parseRRule(rRule)}</small>
    </div>
  );
}

export default RecurrenceForm;
