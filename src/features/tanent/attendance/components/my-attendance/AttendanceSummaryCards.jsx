import React from "react";
import Chart from "react-apexcharts";
import { CalendarCheck, CalendarX, Clock, TrendingUp } from "lucide-react";

function SparklineTrend({ color, data }) {
  const options = {
    chart: { type: "area", sparkline: { enabled: true }, animations: { enabled: false } },
    stroke: { curve: "smooth", width: 2 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.3, opacityTo: 0.05 } },
    colors: [color],
    tooltip: { enabled: false },
  };
  const series = [{ name: "trend", data: data || [3, 5, 2, 7, 5, 8, 6] }];
  return <Chart options={options} series={series} type="area" height={40} width={80} />;
}

export default function AttendanceSummaryCards({ summary }) {
  const cards = [
    {
      title: "Present Days",
      value: summary?.present_days ?? 0,
      subText: "Active field presence",
      icon: CalendarCheck,
      color: "#10b981",
      textColor: "text-emerald-600",
      bg: "bg-emerald-500/5 border-emerald-50",
      trend: [10, 12, 14, 15, 17, 18, summary?.present_days || 0],
    },
    {
      title: "Absent Days",
      value: summary?.absent_days ?? 0,
      subText: "Unexcused gap intervals",
      icon: CalendarX,
      color: "#ef4444",
      textColor: "text-rose-600",
      bg: "bg-rose-500/5 border-rose-50",
      trend: [1, 2, 1, 0, 2, 0, summary?.absent_days || 0],
    },
    {
      title: "Late Days",
      value: summary?.late_days ?? 0,
      subText: "Grace period exception limits",
      icon: Clock,
      color: "#f59e0b",
      textColor: "text-amber-600",
      bg: "bg-amber-500/5 border-amber-50",
      trend: [4, 5, 3, 6, 2, 3, summary?.late_days || 0],
    },
    {
      title: "Attendance Ratio",
      value: `${summary?.attendance_percentage?.toFixed(1) ?? "0.0"}%`,
      subText: "Net framework alignment",
      icon: TrendingUp,
      color: "#3b82f6",
      textColor: "text-indigo-600",
      bg: "bg-indigo-500/5 border-indigo-50",
      trend: [90, 92, 89, 94, 91, 95, parseInt(summary?.attendance_percentage || 0)],
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col justify-between shadow-xs hover:shadow-md transition-all duration-200">
            <div className="flex items-start justify-between w-full">
              <div className="space-y-1">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">{card.title}</span>
                <p className="text-xl font-black text-slate-900 tracking-tight">{card.value}</p>
              </div>
              <div className={`p-2.5 rounded-xl border ${card.bg}`}>
                <IconComponent className={`h-4 w-4 ${card.textColor}`} />
              </div>
            </div>
            <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-50 w-full">
              <span className="text-[10px] text-slate-400 font-medium">{card.subText}</span>
              <SparklineTrend color={card.color} data={card.trend} />
            </div>
          </div>
        );
      })}
    </div>
  );
}