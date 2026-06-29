import React from "react";
import { Clock, CheckCircle2, Calendar, Hourglass } from "lucide-react";

export default function LeaveStatisticsCards({ statistics }) {
  const stats = statistics || { pending: 0, approved: 0, rejected: 0, cancelled: 0, today: 0, this_month: 0, total_days_approved: 0 };

  const schema = [
    { label: "Pending Approvals", value: stats.pending, icon: Hourglass, color: "text-amber-600 bg-amber-50 border-amber-100" },
    { label: "Approved (This Month)", value: stats.approved, icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50 border-emerald-100" },
    { label: "Active Today", value: stats.today, icon: Calendar, color: "text-purple-600 bg-purple-50 border-purple-100" },
    { label: "Net Volume Days Approved", value: `${stats.total_days_approved} d`, icon: Clock, color: "text-indigo-600 bg-indigo-50 border-indigo-100" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {schema.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div key={idx} className="bg-white border border-slate-200/80 rounded-2xl p-4 flex items-center justify-between shadow-3xs hover:shadow-xs transition-all duration-200">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.label}</span>
              <p className="text-xl font-black text-slate-900 tracking-tight">{card.value}</p>
            </div>
            <div className={`p-2.5 rounded-xl border ${card.color}`}>
              <Icon className="h-4 w-4" />
            </div>
          </div>
        );
      })}
    </div>
  );
}