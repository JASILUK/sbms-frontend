import React from "react";
import { CalendarCheck, CalendarX, Clock, TrendingUp, Sun, Moon, Briefcase, Timer, CalendarRange } from "lucide-react";
import SummaryCard from "./summaryCard";
import UnifiedSummaryChart from "./unifideSummaryChart";

export default function AttendanceSummaryCards({ summary }) {
  const totalDays = summary?.total_days ?? 26;
  const percentage = summary?.attendance_percentage ?? 0;

  const mainCards = [
    {
      title: "Present Days",
      value: summary?.present_days ?? 0,
      subText: "Active field presence this month",
      icon: CalendarCheck,
      color: "#10b981",
      textColor: "text-emerald-600",
      bg: "bg-emerald-500/8 border-emerald-100",
      ringMax: totalDays,
      sparklineKey: "present_sparkline",
      trendLabel: "Of total working days",
    },
    {
      title: "Absent Days",
      value: summary?.absent_days ?? 0,
      subText: "Unexcused gap intervals",
      icon: CalendarX,
      color: "#ef4444",
      textColor: "text-rose-600",
      bg: "bg-rose-500/8 border-rose-100",
      ringMax: totalDays,
      sparklineKey: "absent_sparkline",
      trendLabel: "Absence rate",
    },
    {
      title: "Late Days",
      value: summary?.late_days ?? 0,
      subText: "Grace period exceptions",
      icon: Clock,
      color: "#f59e0b",
      textColor: "text-amber-600",
      bg: "bg-amber-500/8 border-amber-100",
      ringMax: totalDays,
      sparklineKey: "late_sparkline",
      trendLabel: "Punctuality impact",
    },
    {
      title: "Attendance Ratio",
      value: `${percentage.toFixed(1)}%`,
      subText: "Net framework alignment",
      icon: TrendingUp,
      color: percentage >= 80 ? "#10b981" : percentage >= 60 ? "#f59e0b" : "#ef4444",
      textColor: "text-indigo-600",
      bg: "bg-indigo-500/8 border-indigo-100",
      ringMax: 100,
      sparklineKey: "percentage_sparkline",
      trendLabel: "Overall performance",
    },
  ];

  const extraStats = [
    { label: "Half Days", value: summary?.half_days ?? 0, icon: Sun, color: "text-orange-500", bg: "bg-orange-50" },
    { label: "Leave Days", value: summary?.leave_days ?? 0, icon: Briefcase, color: "text-violet-500", bg: "bg-violet-50" },
    { label: "Holidays", value: summary?.holiday_days ?? 0, icon: Moon, color: "text-sky-500", bg: "bg-sky-50" },
    { label: "Weekends", value: summary?.weekend_days ?? 0, icon: CalendarCheck, color: "text-slate-500", bg: "bg-slate-50" },
    { label: "Work Hours", value: summary?.total_work_hours?.toFixed(1) ?? "0.0", icon: Timer, color: "text-teal-500", bg: "bg-teal-50" },
    { label: "Overtime", value: summary?.total_overtime_hours?.toFixed(1) ?? "0.0", icon: Timer, color: "text-pink-500", bg: "bg-pink-50" },
  ];

  return (
    <div className="w-full space-y-6">
      {/* Period Label — shows when filtered by date range */}
      {summary?.period_label && (
        <div className="flex items-center gap-2">
          <CalendarRange className="h-3.5 w-3.5 text-indigo-500" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-600 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full">
            {summary.period_label}
          </span>
        </div>
      )}

      {/* 4 Main Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {mainCards.map((card, idx) => (
          <SummaryCard key={idx} {...card} sparklineData={summary?.[card.sparklineKey]} />
        ))}
      </div>

      {/* Unified Chart + Extra Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2">
          <UnifiedSummaryChart summary={summary} />
        </div>

        <div className="lg:col-span-1 space-y-3">
          <div className="bg-white border border-slate-200/70 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Other Metrics</h3>
            <div className="space-y-3">
              {extraStats.map((stat, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50/50 hover:bg-slate-50 transition-colors">
                  <div className={`p-2 rounded-lg ${stat.bg}`}>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    <p className="text-base font-bold text-slate-800">{stat.value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}