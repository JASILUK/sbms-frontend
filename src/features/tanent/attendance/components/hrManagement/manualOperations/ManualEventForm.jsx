import React from "react";
import PropTypes from "prop-types";

export default function ManualEventForm({ activeOp, formData, onChange, errors }) {
  const methodOptions = [
    { value: "MANUAL", label: "Manual Registry Entry" },
    { value: "ADMIN_OVERRIDE", label: "Administrative Workspace Override" },
    { value: "BIOMETRIC", label: "Biometric Hardware Logs Link" },
    { value: "GPS", label: "GPS Coordinates Lock" },
    { value: "FACE_RECOGNITION", label: "Biometric Profile Face Verification" },
  ];

  const showMethodAndLocation = ["check-in", "check-out", "advanced"].includes(activeOp);

  return (
    <div className="space-y-4 text-sm">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Event Ingestion Timestamp Picker */}
        <div className="flex flex-col gap-1.5">
          <label htmlFor="form-event-time" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Event Ingestion Time
          </label>
          <input
            id="form-event-time"
            type="time"
            step="1"
            value={formData.event_time || ""}
            onChange={(e) => onChange("event_time", e.target.value)}
            className={`w-full rounded-xl border bg-white px-3 py-2 text-slate-800 font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
              errors.event_time ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-indigo-500"
            }`}
          />
          {errors.event_time && <span className="text-xs text-rose-600 font-medium">{errors.event_time}</span>}
        </div>

        {/* Dynamic Action Mode Ingestion Sub-Type Input */}
        {activeOp === "advanced" && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="form-event-type" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Advanced Ingestion Event Type
            </label>
            <input
              id="form-event-type"
              type="text"
              placeholder="e.g., PUNCH_IN, BREAK_OVERRIDE"
              value={formData.event_type || ""}
              onChange={(e) => onChange("event_type", e.target.value)}
              className={`w-full rounded-xl border bg-white px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${
                errors.event_type ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-indigo-500"
              }`}
            />
            {errors.event_type && <span className="text-xs text-rose-600 font-medium">{errors.event_type}</span>}
          </div>
        )}

        {/* Attendance Verification Channel Mode Dropdown */}
        {showMethodAndLocation && (
          <div className="flex flex-col gap-1.5">
            <label htmlFor="form-attendance-method" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
              Verification Channel Method
            </label>
            <select
              id="form-attendance-method"
              value={formData.attendance_method || "MANUAL"}
              onChange={(e) => onChange("attendance_method", e.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-700 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            >
              {methodOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Corporate Ingress Geofence Location Input */}
      {showMethodAndLocation && (
        <div className="flex flex-col gap-1.5">
          <label htmlFor="form-location" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
            Ingress Geofence Location Name (Optional)
          </label>
          <input
            id="form-location"
            type="text"
            placeholder="e.g., HQ Corporate Complex Main Terminal"
            value={formData.location_name || ""}
            onChange={(e) => onChange("location_name", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
          />
        </div>
      )}

      {/* Mandatory Regulatory Compliance Context Justification Reason */}
      <div className="flex flex-col gap-1.5">
        <label htmlFor="form-reason" className="text-xs font-bold text-slate-500 uppercase tracking-wider">
          Compliance Justification Narrative
        </label>
        <textarea
          id="form-reason"
          rows={3}
          placeholder="Provide required explanatory text context why this manual action override is being performed..."
          value={formData.reason || ""}
          onChange={(e) => onChange("reason", e.target.value)}
          className={`w-full rounded-xl border bg-white px-3 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-xs leading-relaxed ${
            errors.reason ? "border-rose-400 focus:border-rose-500" : "border-slate-200 focus:border-indigo-500"
          }`}
        />
        {errors.reason && <span className="text-xs text-rose-600 font-medium">{errors.reason}</span>}
      </div>
    </div>
  );
}

ManualEventForm.propTypes = {
  activeOp: PropTypes.string.isRequired,
  formData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
};