export const formatHumanReadableDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const getHolidayTypeBadgeStyles = (type) => {
  const normalized = String(type).toLowerCase();
  switch (normalized) {
    case "public":
      return "bg-emerald-50 text-emerald-700 border-emerald-200/60";
    case "company":
      return "bg-indigo-50 text-indigo-700 border-indigo-200/60";
    case "religious":
      return "bg-amber-50 text-amber-700 border-amber-200/60";
    case "government":
      return "bg-purple-50 text-purple-700 border-purple-200/60";
    case "regional":
      return "bg-sky-50 text-sky-700 border-sky-200/60";
    default:
      return "bg-slate-50 text-slate-700 border-slate-200/60";
  }
};