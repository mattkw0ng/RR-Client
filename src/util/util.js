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