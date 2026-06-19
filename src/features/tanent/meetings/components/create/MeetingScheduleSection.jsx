import React, { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Calendar, Clock, Globe, RefreshCw, Bell } from "lucide-react";

export default function MeetingScheduleSection() {
  const { register, setValue, control } = useFormContext();

  // Watch schedule_type and recurrence_rule settings to handle UI states dynamically
  const scheduleType = useWatch({ control, name: "schedule_type", defaultValue: "scheduled" });
  const recurrenceFrequency = useWatch({ control, name: "recurrence_rule.frequency", defaultValue: "daily" });
  const selectedDays = useWatch({ control, name: "recurrence_rule.days", defaultValue: [] });

  // Watch selected scheduled start and current reminders to apply the UX conditions
  const scheduledStart = useWatch({ control, name: "scheduled_start" });
  const selectedReminders = useWatch({ control, name: "reminder_minutes", defaultValue: [] });

  // Keep a reference to the initial start time to know if the user has changed it
  const initialStartRef = useRef(null);

  useEffect(() => {
    if (scheduledStart && !initialStartRef.current) {
      initialStartRef.current = scheduledStart;
    }
  }, [scheduledStart]);

  const weekDays = [
    { label: "M", value: "monday" },
    { label: "T", value: "tuesday" },
    { label: "W", value: "wednesday" },
    { label: "T", value: "thursday" },
    { label: "F", value: "friday" },
    { label: "S", value: "saturday" },
    { label: "S", value: "sunday" },
  ];

  const reminderOptions = [
    { value: 5, label: "5 min" },
    { value: 10, label: "10 min" },
    { value: 15, label: "15 min" },
    { value: 30, label: "30 min" },
    { value: 60, label: "1 hour" },
    { value: 120, label: "2 hours" },
    { value: 1440, label: "1 day" },
    { value: 10080, label: "1 week" },
  ];

  // Dynamic calculations to validate reminders against the selected start time
  const now = Date.now();
  const startTimeMs = scheduledStart ? new Date(scheduledStart).getTime() : 0;
  const minutesUntilMeeting = startTimeMs > now ? (startTimeMs - now) / 60000 : 0;

  // Determine if the start time has been explicitly changed from the initial loaded value
  const hasStartTimeChanged = initialStartRef.current && initialStartRef.current !== scheduledStart;

  // Track and filter out selected reminders that become invalid when active future modifications happen
  useEffect(() => {
    if (scheduleType !== "instant" && scheduledStart && hasStartTimeChanged) {
      const validReminders = selectedReminders.filter((minutes) => minutes <= minutesUntilMeeting);
      if (validReminders.length !== selectedReminders.length) {
        setValue("reminder_minutes", validReminders, { shouldValidate: true });
      }
    }
  }, [scheduledStart, minutesUntilMeeting, scheduleType, selectedReminders, setValue, hasStartTimeChanged]);

  const handleDayToggle = (dayValue) => {
    if (selectedDays.includes(dayValue)) {
      setValue(
        "recurrence_rule.days",
        selectedDays.filter((d) => d !== dayValue),
        { shouldValidate: true }
      );
    } else {
      setValue("recurrence_rule.days", [...selectedDays, dayValue], { shouldValidate: true });
    }
  };

  const handleReminderToggle = (value) => {
    if (selectedReminders.includes(value)) {
      setValue(
        "reminder_minutes",
        selectedReminders.filter((v) => v !== value),
        { shouldValidate: true }
      );
    } else {
      setValue("reminder_minutes", [...selectedReminders, value], { shouldValidate: true });
    }
  };

  return (
    <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-6 shadow-sm">
      {/* Section Header */}
      <div>
        <h2 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-500" />
          Schedule Configuration
        </h2>
        <p className="text-sm text-slate-500 mt-0.5">
          Configure meeting timing, frequency, and cross-border configurations.
        </p>
      </div>

      {/* Schedule Type Selection Tabs */}
      <div>
        <label className="text-xs font-semibold text-slate-700 uppercase tracking-wider">
          Schedule Type
        </label>
        <div className="grid grid-cols-3 gap-2 mt-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
          {[
            { value: "instant", label: "Instant Meeting" },
            { value: "scheduled", label: "One-time" },
            { value: "recurring", label: "Recurring" },
          ].map((type) => {
            const isActive = scheduleType === type.value;
            return (
              <button
                key={type.value}
                type="button"
                onClick={() => {
                  setValue("schedule_type", type.value);
                  if (type.value !== "recurring") {
                    setValue("recurrence_rule", null); // Keep data payload clean
                  } else {
                    // Initialize clean defaults matched with backend validators
                    setValue("recurrence_rule", {
                      frequency: "daily",
                      interval: 1,
                      until: null,
                    });
                  }
                }}
                className={`
                  py-2 text-xs font-medium rounded-lg transition-all duration-200
                  ${isActive 
                    ? "bg-white text-indigo-600 shadow-sm border border-slate-100" 
                    : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                  }
                `}
              >
                {type.value === "recurring" && <RefreshCw className={`w-3 h-3 inline mr-1 ${isActive && "animate-spin-slow"}`} />}
                {type.label}
              </button>
            );
          })}
          {/* Register tracking field within the react-hook-form schema context */}
          <input type="hidden" {...register("schedule_type", { defaultValue: "scheduled" })} />
        </div>
      </div>

      {/* Timeline Controls: Conditional visualization hidden on "instant" configuration parameters */}
      {scheduleType !== "instant" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
          <div>
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              Start Time
            </label>
           <input
  type="datetime-local"
  {...register("scheduled_start", {
    required: scheduleType !== "instant",
  })}
  onChange={(e) => {
    console.log(
      "START INPUT RAW:",
      e.target.value
    );
  }}
/>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              End Time
            </label>
           <input
  type="datetime-local"
  {...register("scheduled_end", {
    required: scheduleType !== "instant",
  })}
  onChange={(e) => {
    console.log(
      "END INPUT RAW:",
      e.target.value
    );
  }}
/>
          </div>
        </div>
      )}

      {/* Global Timezone Picker */}
      <div>
        <label className="block text-sm font-medium text-slate-700 flex items-center gap-1.5">
          <Globe className="w-3.5 h-3.5 text-slate-400" />
          Timezone
        </label>
        <select
          {...register("timezone", { defaultValue: "UTC" })}
          className="w-full mt-1.5 border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
        >
          <option value="UTC">Coordinated Universal Time (UTC)</option>
          <option value="Asia/Kolkata">India Standard Time (IST)</option>
          <option value="America/New_York">Eastern Standard Time (EST)</option>
          <option value="Europe/London">Greenwich Mean Time (GMT)</option>
          <option value="Asia/Dubai">Gulf Standard Time (GST)</option>
        </select>
      </div>

      {/* Real-World Recurring Configuration Interface */}
      {scheduleType === "recurring" && (
        <div className="border border-indigo-100 bg-indigo-50/30 rounded-2xl p-4 space-y-4 animate-slideDown">
          <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 uppercase tracking-wider">
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            Recurrence Rule Settings
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Frequency Selection */}
            <div>
              <label className="block text-xs font-medium text-slate-600">Frequency</label>
              <select
                {...register("recurrence_rule.frequency")}
                className="w-full mt-1.5 border border-slate-200 bg-white rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>

            {/* Interval Field */}
            <div>
              <label className="block text-xs font-medium text-slate-600">Repeat Every</label>
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="number"
                  min="1"
                  defaultValue={1}
                  {...register("recurrence_rule.interval", { valueAsNumber: true, min: 1 })}
                  className="w-20 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
                <span className="text-xs text-slate-500">
                  {recurrenceFrequency === "daily" && "day(s)"}
                  {recurrenceFrequency === "weekly" && "week(s)"}
                  {recurrenceFrequency === "monthly" && "month(s)"}
                </span>
              </div>
            </div>
          </div>

          {/* Conditional Weekly Input Matrix */}
          {recurrenceFrequency === "weekly" && (
            <div className="space-y-1.5 animate-fadeIn">
              <label className="block text-xs font-medium text-slate-600">Repeat On</label>
              <div className="flex gap-1.5 flex-wrap pt-1">
                {weekDays.map((day) => {
                  const isSelected = selectedDays.includes(day.value);
                  return (
                    <button
                      key={day.value}
                      type="button"
                      onClick={() => handleDayToggle(day.value)}
                      className={`
                        w-8 h-8 rounded-full text-xs font-semibold transition-all duration-150 border
                        ${isSelected
                          ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                          : "bg-white border-slate-200 text-slate-600 hover:border-slate-300"
                        }
                      `}
                    >
                      {day.label}
                    </button>
                  );
                })}
              </div>
              {/* Invisible anchor tracking field hook to push value matrix to backend safely */}
              <input type="hidden" {...register("recurrence_rule.days")} />
            </div>
          )}

          {/* Conditional Monthly Field Definition */}
          {recurrenceFrequency === "monthly" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-fadeIn">
              <div>
                <label className="block text-xs font-medium text-slate-600">Day of Month</label>
                <input
                  type="number"
                  min="1"
                  max="31"
                  placeholder="e.g. 15"
                  {...register("recurrence_rule.day_of_month", { valueAsNumber: true, min: 1, max: 31 })}
                  className="w-full mt-1.5 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>
          )}

          {/* Recurrence Termination Condition Boundary */}
          <div>
            <label className="block text-xs font-medium text-slate-600">End Recurrence (Until)</label>
            <input
              type="datetime-local"
              {...register("recurrence_rule.until")}
              className="w-full mt-1.5 border border-slate-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 bg-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Leave blank to keep repeating indefinitely. Must be an ISO datetime string.
            </p>
          </div>
        </div>
      )}

      {/* Production-Grade Meeting Reminder Settings */}
      {scheduleType !== "instant" && (
        <div className="space-y-3 pt-2 border-t border-slate-100 animate-fadeIn">
          <div>
            <label className="text-sm font-medium text-slate-700 flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-slate-400" />
              Reminder Settings
            </label>
            <p className="text-xs text-slate-400 mt-0.5">
              Reminder options update automatically based on the selected meeting time.
            </p>
          </div>

          <div className="flex gap-2 flex-wrap pt-1">
            {reminderOptions.map((option) => {
              const isSelected = selectedReminders.includes(option.value);
              
              // Only apply standard dynamic constraint restrictions if the user has touched/changed the start date
              const isDisabled = hasStartTimeChanged && (!scheduledStart || option.value > minutesUntilMeeting);

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={isDisabled}
                  onClick={() => handleReminderToggle(option.value)}
                  className={`
                    px-3 py-1.5 text-xs font-medium rounded-xl border transition-all duration-150
                    ${isSelected
                      ? "bg-indigo-600 border-indigo-600 text-white shadow-sm"
                      : isDisabled
                      ? "bg-slate-50 border-slate-100 text-slate-300 cursor-not-allowed"
                      : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50/50"
                    }
                  `}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
          {/* Register reminder field within the form lifecycle schema context */}
          <input type="hidden" {...register("reminder_minutes")} />
        </div>
      )}
    </div>
  );
}