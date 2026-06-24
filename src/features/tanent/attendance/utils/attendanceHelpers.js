/**
 * Formats net active minutes into an enterprise-friendly string format (e.g., 450 -> "7h 30m").
 * @param {number} minutes 
 * @returns {string}
 */
export const formatMinutesToHours = (minutes) => {
  if (!minutes || isNaN(minutes)) return "0h 0m";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};

/**
 * Converts any standard ISO string or timestamp safely into local 12-hour AM/PM format.
 * @param {string} isoString 
 * @returns {string}
 */
export const formatUtcToLocal = (isoString) => {
  if (!isoString) return "--:--";
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch (e) {
    return "--:--";
  }
};

/**
 * Parses and maps backend date strings into human-readable views.
 * @param {string} dateString 
 * @returns {string}
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

/**
 * Returns corporate design guidelines and style parameters based on state flags.
 * @param {string} status 
 * @returns {object} Style properties schema
 */
export const getStatusColor = (status) => {
  const normalized = status ? status.toUpperCase() : "ABSENT";
  switch (normalized) {
    case "PRESENT":
      return {
        bg: "bg-emerald-50 border-emerald-100",
        text: "text-emerald-700",
        border: "border-emerald-200",
        icon: "text-emerald-500",
        chartColor: "#10b981",
      };
    case "LATE":
      return {
        bg: "bg-amber-50 border-amber-100",
        text: "text-amber-700",
        border: "border-amber-200",
        icon: "text-amber-500",
        chartColor: "#f59e0b",
      };
    case "ABSENT":
      return {
        bg: "bg-rose-50 border-rose-100",
        text: "text-rose-700",
        border: "border-rose-200",
        icon: "text-rose-500",
        chartColor: "#ef4444",
      };
    case "LEAVE":
      return {
        bg: "bg-sky-50 border-sky-100",
        text: "text-sky-700",
        border: "border-sky-200",
        icon: "text-sky-500",
        chartColor: "#3b82f6",
      };
    case "WEEKEND":
      return {
        bg: "bg-purple-50 border-purple-100",
        text: "text-purple-700",
        border: "border-purple-200",
        icon: "text-purple-500",
        chartColor: "#a855f7",
      };
    case "HOLIDAY":
      return {
        bg: "bg-slate-100 border-slate-200",
        text: "text-slate-700",
        border: "border-slate-300",
        icon: "text-slate-500",
        chartColor: "#64748b",
      };
    default:
      return {
        bg: "bg-slate-50 border-slate-100",
        text: "text-slate-600",
        border: "border-slate-200",
        icon: "text-slate-400",
        chartColor: "#94a3b8",
      };
  }
};

export const getStatusLabel = (status) => {
  if (!status) return "Absent";
  const normalized = status.toUpperCase();
  if (normalized === "HALF_DAY") return "Half Day";
  return status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
};