import React from "react";
import Chart from "react-apexcharts";

export default function UnifiedSummaryChart({ summary }) {
  const categories = ["Present", "Absent", "Late", "Half", "Leave", "Holiday", "Weekend"];

  const values = [
    summary?.present_days ?? 0,
    summary?.absent_days ?? 0,
    summary?.late_days ?? 0,
    summary?.half_days ?? 0,
    summary?.leave_days ?? 0,
    summary?.holiday_days ?? 0,
    summary?.weekend_days ?? 0,
  ];

  const colors = ["#10b981", "#ef4444", "#f59e0b", "#f97316", "#8b5cf6", "#0ea5e9", "#64748b"];

  const options = {
    chart: {
      type: "donut",
      animations: { enabled: true, speed: 800 },
    },
    labels: categories,
    colors: colors,
    plotOptions: {
      pie: {
        donut: {
          size: "65%",
          labels: {
            show: true,
            name: { show: true, fontSize: "12px", fontWeight: 600, color: "#64748b" },
            value: { show: true, fontSize: "18px", fontWeight: 700, color: "#1e293b" },
            total: {
              show: true,
              label: "Total Days",
              fontSize: "12px",
              fontWeight: 600,
              color: "#64748b",
              formatter: () => summary?.total_days ?? 0,
            },
          },
        },
      },
    },
    stroke: { show: true, colors: ["#fff"], width: 3 },
    dataLabels: { enabled: false },
    legend: {
      position: "bottom",
      fontSize: "12px",
      fontWeight: 500,
      labels: { colors: "#64748b" },
      markers: { width: 10, height: 10, radius: 4 },
    },
    tooltip: {
      y: {
        formatter: (val) => `${val} days`,
      },
    },
  };

  const series = values;

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Attendance Distribution</h3>
          <p className="text-xs text-slate-400 mt-0.5">Unified overview of all day types</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-slate-400 font-medium">Attendance Rate</p>
          <p className={`text-lg font-black ${(summary?.attendance_percentage ?? 0) >= 80 ? "text-emerald-500" : (summary?.attendance_percentage ?? 0) >= 60 ? "text-amber-500" : "text-rose-500"}`}>
            {summary?.attendance_percentage?.toFixed(1) ?? "0.0"}%
          </p>
        </div>
      </div>
      <Chart options={options} series={series} type="donut" height={320} />
    </div>
  );
}