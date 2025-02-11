import ROOMS from "../data/rooms";
import { format, isSameDay, parseISO } from 'date-fns';

// Convert slider value (0–47) to time in "hh:mm AM/PM" format
export const formatTime = (value) => {
  const hour = Math.floor(value / 2);
  const minute = value % 2 === 0 ? "00" : "30";
  const period = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 === 0 ? 12 : hour % 12;
  return `${formattedHour}:${minute} ${period}`;
};

export const formatDisplayTime = (time) => {
  return new Date(time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

export const areTimeRangesOverlapping = (range1, range2) => {
  // Convert dateTime strings to Date objects
  const start1 = new Date(range1.start.dateTime);
  const end1 = new Date(range1.end.dateTime);
  const start2 = new Date(range2.start.dateTime);
  const end2 = new Date(range2.end.dateTime);

  // Check if ranges overlap
  return start1 < end2 && start2 < end1;
}

// Display Event Dates Neatly
export function formatEventDates(startDate, endDate) {
  const start = parseISO(startDate);
  const end = parseISO(endDate);

  // Format for single time range if both dates are on the same day
  if (isSameDay(start, end)) {
    return `${format(start, 'eee, MMM do h:mmaaa')}-${format(end, 'h:mmaaa')}`;
  }

  // Format separately if the dates are on different days
  return `${format(start, 'eee, MMM do h:mmaaa')} - ${format(end, 'eee, MMM do h:mmaaa')}`;
}

export function getRoomNameByCalendarID(calendarID) {
  const entry = Object.entries(ROOMS).find(([roomName, roomData]) => roomData.calendarID === calendarID);
  console.log(calendarID, entry);
  return entry ? entry[0] : null; // Return the room name (key) or null if not found
}

export function roundToNearestHalfHour(date = new Date()) {
  const minutes = date.getMinutes();
  const roundedMinutes = minutes < 15 ? 0 : minutes < 45 ? 30 : 60;

  // Adjust the hour if rounding up to the next hour
  if (roundedMinutes === 60) {
    date.setHours(date.getHours() + 1);
    date.setMinutes(0);
  } else {
    date.setMinutes(roundedMinutes);
  }

  date.setSeconds(0);
  date.setMilliseconds(0);

  return date;
};

export function getWeekdayIfSame(startDate, endDate) {
  const weekdays = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];

  const start = new Date(startDate);
  const end = new Date(endDate);

  // Check if both dates have the same weekday
  if (start.toDateString() === end.toDateString()) {
    return weekdays[start.getDay()]; // Return the weekday code
  }

  return null; // Return null if the event spans multiple days
}


export function parseRRule(rRule) {
  if (!rRule) return "No recurrence set.";
  console.log("Parsing rRule: ", rRule)
  // Split the rRule into key-value pairs
  const ruleParts = rRule
    .replace("RRULE:", "")
    .split(";")
    .reduce((acc, part) => {
      const [key, value] = part.split("=");
      acc[key] = value;
      return acc;
    }, {});

  // Map frequency to a readable format
  const frequencyMap = {
    DAILY: "day",
    WEEKLY: "week",
    MONTHLY: "month",
    YEARLY: "year",
  };

  const daysMap = {
    MO: "Monday",
    TU: "Tuesday",
    WE: "Wednesday",
    TH: "Thursday",
    FR: "Friday",
    SA: "Saturday",
    SU: "Sunday",
  };

  const freq = frequencyMap[ruleParts.FREQ] || "custom recurrence";
  const interval = ruleParts.INTERVAL ? `every ${ruleParts.INTERVAL} ${freq}${ruleParts.INTERVAL > 1 ? 's' : ''}` : `every ${freq}`;
  const count = ruleParts.COUNT ? ` ${ruleParts.COUNT} time${ruleParts.COUNT > 1 ? 's' : ''}` : "";
  console.log("ParseRRule ruleparts.until: ", ruleParts.UNTIL);

  const rruleDateString = ruleParts.UNTIL;
  const formattedDate = rruleDateString ? new Date(
    `${rruleDateString.slice(0, 4)}-${rruleDateString.slice(4, 6)}-${rruleDateString.slice(6, 8)}T${rruleDateString.slice(9, 11)}:${rruleDateString.slice(11, 13)}:${rruleDateString.slice(13, 15)}Z`
  ) : null;

  const until = ruleParts.UNTIL
    ? ` until ${formattedDate.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}`
    : "";

  // Parse BYDAY if present
  const byDay = ruleParts.BYDAY
    ? ` on ${ruleParts.BYDAY.split(",").map((day) => daysMap[day]).join(", ")}`
    : "";

  // Combine the sentence
  return `"Repeats ${interval}${byDay}${count}${until}."`;
};

