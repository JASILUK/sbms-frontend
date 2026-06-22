import React from "react";
import { Clock, Globe, ShieldAlert } from "lucide-react";

// Reusable child item to ensure uniform UI styling and scale maintainability
const SnapshotItem = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3 rounded-lg border border-gray-200 bg-white p-4 font-sans transition-colors duration-150 ease-in-out hover:border-gray-300/80">
    <div className="mt-0.5 shrink-0 text-gray-400">
      <Icon className="h-4 w-4" aria-hidden="true" />
    </div>
    <div className="space-y-0.5 min-w-0">
      <span className="block text-xs font-medium text-gray-500">
        {label}
      </span>
      <span className="block text-sm font-semibold text-gray-900 break-words">
        {value}
      </span>
    </div>
  </div>
);

export const ScheduleOverviewCard = ({ schedule }) => {
  // Graceful block return if schedule data context is absent
  if (!schedule) return null;

  // Formatting backend parameters down to friendly operational values
  const defaultShift = schedule.default_shift?.name || "General Shift";
  const timezone = schedule.timezone || "Not Configured";
  
  const complianceRegion = schedule.country 
    ? `${schedule.country} (${schedule.state || "National"})`
    : "Global Baseline";

  return (
    <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
      <SnapshotItem 
        icon={Clock} 
        label="Default Shift" 
        value={defaultShift} 
      />
      <SnapshotItem 
        icon={Globe} 
        label="Timezone" 
        value={timezone} 
      />
      <SnapshotItem 
        icon={ShieldAlert} 
        label="Compliance Region" 
        value={complianceRegion} 
      />
    </div>
  );
};