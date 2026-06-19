import React, { useMemo, useEffect } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import { Bell } from "lucide-react";

const REMINDER_OPTIONS = [
  { value: 5, label: "5 min" },
  { value: 10, label: "10 min" },
  { value: 15, label: "15 min" },
  { value: 30, label: "30 min" },
  { value: 60, label: "1 hour" },
  { value: 120, label: "2 hours" },
  { value: 1440, label: "1 day" },
  { value: 10080, label: "1 week" },
];

export default function MeetingReminderSection() {
  const { register, setValue, control } = useFormContext();

  // Watch scheduled_start to dynamically enable/disable reminder options
  const scheduledStart = useWatch({ control, name: "scheduled_start" });
  const reminderMinutes = useWatch({ control, name: "reminder_minutes", defaultValue: [] });

  // Compute which reminder options are valid based on the selected start time
  const validOptions = useMemo(() => {
    if (!scheduledStart) {
      // If no start time is selected, all options are considered valid (allow selection)
      return new Set(REMINDER_OPTIONS.map((opt) => opt.value));
    }

    const startTime = new Date(scheduledStart);
    const now = new Date();
    const diffMs = startTime.getTime() - now.getTime();
    const diffMinutes = diffMs / (1000 * 60);

    return new Set(
      REMINDER_OPTIONS.filter((opt) => diffMinutes > opt.value).map((opt) => opt.value)
    );
  }, [scheduledStart]);

  // Auto-remove selected reminders that become invalid when start time changes
  useEffect(() => {
    if (!Array.isArray(reminderMinutes) || reminderMinutes.length === 0) return;

    const cleaned = reminderMinutes.filter((val) => validOptions.has(val));
    if (cleaned.length !== reminderMinutes.length) {
      setValue("reminder_minutes", cleaned, { shouldValidate: true });
    }
  }, [validOptions, reminderMinutes, setValue]);

  const handleToggle = (value) => {
    if (!validOptions.has(value)) return;

    const current = Array.isArray(reminderMinutes) ? reminderMinutes : [];
    if (current.includes(value)) {
      setValue(
        "reminder_minutes",
        current.filter((v) => v !== value),
        { shouldValidate: true }
      );
    } else {
      setValue("reminder_minutes", [...current, value], { shouldValidate: true });
    }
  };

  return (
    <div className="border border-amber-100 bg-amber-50/30 rounded-2xl p-4 space-y-4 animate-fadeIn">
      <div className="flex items-center gap-2 text-xs font-semibold text-amber-700 uppercase tracking-wider">
        <Bell className="w-3.5 h-3.5" />
        Reminder Settings
      </div>

      <div className="space-y-2">
        <label className="block text-xs font-medium text-slate-600">
          Select Reminders
        </label>
        <div className="flex flex-wrap gap-2 pt-1">
          {REMINDER_OPTIONS.map((option) => {
            const isValid = validOptions.has(option.value);
            const isSelected = Array.isArray(reminderMinutes) && reminderMinutes.includes(option.value);

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => handleToggle(option.value)}
                disabled={!isValid}
                className={`
                  px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border
                  ${isSelected && isValid
                    ? "bg-amber-500 border-amber-500 text-white shadow-sm"
                    : isValid
                      ? "bg-white border-slate-200 text-slate-600 hover:border-amber-300 hover:text-amber-700"
                      : "bg-slate-100 border-slate-200 text-slate-400 cursor-not-allowed"
                  }
                `}
              >
                {option.label}
              </button>
            );
          })}
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Reminder options update automatically based on the selected meeting time.
        </p>
      </div>

      {/* Hidden input to register reminder_minutes in react-hook-form */}
      <input type="hidden" {...register("reminder_minutes")} />
    </div>
  );
}