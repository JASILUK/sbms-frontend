import React from "react";
import { Users, CheckSquare, Video, FileText, Activity, HelpCircle } from "lucide-react";

/**
 * Safely formats any value (number, string, null, undefined, or array/object)
 * for rendering without throwing a TypeError.
 */
const renderSummaryValue = (val) => {
  if (val === null || val === undefined) {
    return 0;
  }
  if (Array.isArray(val)) {
    return val.length;
  }
  if (typeof val === "object") {
    return Object.keys(val).length;
  }
  return val;
};

const SummaryBlock = ({ title, icon: IconProp, data }) => {
  // Ensure Icon is a valid component, fallback to HelpCircle if undefined
  const Icon = IconProp || HelpCircle;

  // Guard against null or non-object values passed as data
  const safeData = data && typeof data === "object" ? data : {};
  const entries = Object.entries(safeData);

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center gap-2.5 mb-4 text-slate-900 font-bold text-sm">
        <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0">
          <Icon className="w-4 h-4" />
        </div>
        <span>{title}</span>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-slate-400 italic">No metrics available</p>
      ) : (
        <div className="grid grid-cols-2 gap-2.5 text-xs">
          {entries.map(([key, val]) => (
            <div
              key={key}
              className="p-3 rounded-xl bg-slate-50/80 border border-slate-100 flex flex-col justify-between"
            >
              <span className="text-slate-500 font-medium capitalize text-[11px]">
                {key.replace(/_/g, " ")}
              </span>
              <span className="font-extrabold text-slate-900 text-lg mt-1 tracking-tight">
                {renderSummaryValue(val)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export const ProjectOverviewGrid = ({ project }) => {
  if (!project) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <SummaryBlock
        title="Member Summary"
        icon={Users}
        data={project.member_summary}
      />
      <SummaryBlock
        title="Task Summary"
        icon={CheckSquare}
        data={project.task_summary}
      />
      <SummaryBlock
        title="Meeting Summary"
        icon={Video}
        data={project.meeting_summary}
      />
      <SummaryBlock
        title="File Summary"
        icon={FileText}
        data={project.file_summary}
      />
      <SummaryBlock
        title="Activity Stream"
        icon={Activity}
        data={project.activity_summary}
      />
    </div>
  );
};