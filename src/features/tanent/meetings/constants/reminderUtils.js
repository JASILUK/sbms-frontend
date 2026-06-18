export const REMINDER_OPTIONS = [
  { value: 5, label: "5 Minutes Before" },
  { value: 10, label: "10 Minutes Before" },
  { value: 15, label: "15 Minutes Before" },
  { value: 30, label: "30 Minutes Before" },
  { value: 60, label: "1 Hour Before" },
  { value: 120, label: "2 Hours Before" },
  { value: 1440, label: "1 Day Before" },
  { value: 10080, label: "1 Week Before" },
];

export const formatReminderLabel = (value) => {
  const found = REMINDER_OPTIONS.find((opt) => opt.value === value);
  return found ? found.label : `${value} Minutes Before`;
};