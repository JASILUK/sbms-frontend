// attendance-setup/components/overview/SetupStatusGrid.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { Calendar, Shield, PartyPopper, Clock, Users, ArrowUpRight } from "lucide-react";

export const SetupStatusGrid = ({ modules }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
      <SetupStatusCard 
        title="Working Schedule"
        description={`${modules.schedule.raw?.work_days?.length || 0} active working days mapped under system standard time parameters.`}
        isConfigured={modules.schedule.isConfigured}
        icon={Calendar}
        path="/app/attendance/setup/schedule"
      />
      <SetupStatusCard 
        title="Attendance Policy"
        description={modules.policy.isConfigured ? `Core work shifts initialized at standard baseline thresholds (${modules.policy.raw?.required_hours} Hours required).` : "No parameters active."}
        isConfigured={modules.policy.isConfigured}
        icon={Shield}
        path="/app/attendance/setup/policy"
      />
      <SetupStatusCard 
        title="Holidays Register"
        description={`${modules.holidays.raw?.length || 0} calendar days registered as corporate observation windows.`}
        isConfigured={modules.holidays.isConfigured}
        icon={PartyPopper}
        path="/app/attendance/setup/holidays"
      />
      <SetupStatusCard 
        title="Shift Templates"
        description={`${modules.shifts.raw?.length || 0} production patterns compiled in the baseline template inventory.`}
        isConfigured={modules.shifts.isConfigured}
        icon={Clock}
        path="/app/attendance/setup/shifts"
      />
      <div className="md:col-span-2">
        <SetupStatusCard 
          title="Shift Assignments"
          description={`${modules.assignments.raw?.length || 0} corporate members mapped onto live production profiles.`}
          isConfigured={modules.assignments.isConfigured}
          icon={Users}
          path="/app/attendance/setup/assignments"
        />
      </div>
    </div>
  );
};

// Internal Individual Parameter Layout Component
const SetupStatusCard = ({ title, description, isConfigured, icon: Icon, path }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs flex items-start gap-4 hover:border-slate-300 transition-colors">
      <div className={`p-2.5 rounded-lg border ${
        isConfigured ? "bg-emerald-50 text-emerald-600 border-emerald-100" : "bg-slate-50 text-slate-400 border-slate-100"
      }`}>
        <Icon className="h-5 w-5 shrink-0" />
      </div>

      <div className="space-y-1 overflow-hidden flex-1">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-bold text-sm text-slate-900 truncate">{title}</h4>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
            isConfigured ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"
          }`}>
            {isConfigured ? "Mapped" : "Empty"}
          </span>
        </div>
        <p className="text-xs text-slate-400 leading-normal line-clamp-2 pr-2">{description}</p>
        <button 
          onClick={() => navigate(path)}
          className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 pt-2 cursor-pointer transition-colors"
        >
          Manage Parameters <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );
};