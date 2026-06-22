export const formatTime12Hour = (timeString) => {
  if (!timeString) return "—";
  const [hoursStr, minutesStr] = timeString.split(":");
  const hours = parseInt(hoursStr, 10);
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return `${String(displayHours).padStart(2, "0")}:${minutesStr} ${ampm}`;
};

export const calculateShiftDuration = (start, end, breakMinutes = 0) => {
  if (!start || !end) return 0;
  
  const [startH, startM] = start.split(":").map(Number);
  const [endH, endM] = end.split(":").map(Number);
  
  let startTotalMinutes = startH * 60 + startM;
  let endTotalMinutes = endH * 60 + endM;
  
  // Handle overnight boundary shifts correctly
  if (endTotalMinutes <= startTotalMinutes) {
    endTotalMinutes += 24 * 60;
  }
  
  const grossMinutes = endTotalMinutes - startTotalMinutes;
  const netMinutes = grossMinutes - (Number(breakMinutes) || 0);
  
  const hours = netMinutes / 60;
  return Math.max(0, parseFloat(hours.toFixed(2)));
};

export const formatDurationText = (hoursValue) => {
  if (hoursValue <= 0) return "0 Hours";
  const wholeHours = Math.floor(hoursValue);
  const minutes = Math.round((hoursValue - wholeHours) * 60);
  
  if (minutes === 0) {
    return `${wholeHours} ${wholeHours === 1 ? "Hour" : "Hours"}`;
  }
  return `${wholeHours}h ${minutes}m`;
};