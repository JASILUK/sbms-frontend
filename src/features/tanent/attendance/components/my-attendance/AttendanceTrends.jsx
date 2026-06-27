import React, { useState, useMemo } from "react";
import Chart from "react-apexcharts";
import {
  BarChart3,
  LineChart,
  ChevronLeft,
  ChevronRight,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Target,
  Zap,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";

/* ── Animated Counter ────────────────────────────────────────────────────────── */
const useCountUp = (end, duration = 1200) => {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(end * eased);
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  return count;
};

/* ── Stat Pill ───────────────────────────────────────────────────────────────── */
const StatPill = ({ icon: Icon, label, value, trend, color }) => {
  const TrendIcon = trend > 0 ? ArrowUpRight : trend < 0 ? ArrowDownRight : Minus;
  const trendColor = trend > 0 ? "text-emerald-500" : trend < 0 ? "text-rose-500" : "text-slate-400";
  const bgMap = {
    emerald: "bg-emerald-50 border-emerald-100",
    amber: "bg-amber-50 border-amber-100",
    rose: "bg-rose-50 border-rose-100",
    indigo: "bg-indigo-50 border-indigo-100",
  };

  return (
    <div className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${bgMap[color] || bgMap.indigo}`}>
      <Icon className={`h-3.5 w-3.5 ${trendColor}`} />
      <div>
        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{label}</p>
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-slate-800">{Math.round(value)}</span>
          {trend !== undefined && (
            <span className={`flex items-center text-[10px] font-bold ${trendColor}`}>
              <TrendIcon className="h-3 w-3" />
              {Math.abs(trend)}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ──────────────────────────────────────────────────────────── */
export default function AttendanceTrends({
  trends,
  year,
  onYearChange,
  onWeeklyNext,
  onWeeklyPrev,
  weeklyPagination,
}) {
  const [activeTab, setActiveTab] = useState("monthly");

  const monthly = trends?.monthly || [];
  const weekly = trends?.weekly || [];

  const yearOptions = useMemo(() => {
    const current = new Date().getFullYear();
    return Array.from({ length: 7 }, (_, i) => current - 5 + i);
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    if (!monthly.length) return null;
    const totalPresent = monthly.reduce((s, m) => s + (m.present || 0), 0);
    const totalAbsent = monthly.reduce((s, m) => s + (m.absent || 0), 0);
    const totalLate = monthly.reduce((s, m) => s + (m.late || 0), 0);
    const avgRate = monthly.length
      ? monthly.reduce((s, m) => s + ((m.present || 0) / Math.max(m.total || 1)) * 100, 0) / monthly.length
      : 0;
    return { totalPresent, totalAbsent, totalLate, avgRate };
  }, [monthly]);

  const animPresent = useCountUp(stats?.totalPresent || 0);
  const animAbsent = useCountUp(stats?.totalAbsent || 0);
  const animLate = useCountUp(stats?.totalLate || 0);
  const animRate = useCountUp(stats?.avgRate || 0);

  // ── Monthly Chart: ABSOLUTE counts with percentage tooltip ──
  const monthlyOptions = {
    chart: {
      type: "bar",
      stacked: true,
      toolbar: { show: false },
      fontFamily: "inherit",
    },
    colors: ["#10b981", "#f59e0b", "#ef4444", "#8b5cf6"],
    plotOptions: {
      bar: {
        columnWidth: "55%",
        borderRadius: 6,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
      },
    },
    xaxis: {
      categories: monthly.map((m) =>
        new Date(2024, m.month - 1, 1).toLocaleDateString("en-US", { month: "short" })
      ),
      labels: { style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      show: true,
      labels: {
        style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 },
        formatter: (val) => Math.round(val),
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      padding: { top: 10, right: 10, bottom: 0, left: 10 },
    },
    legend: { show: false },
    dataLabels: { enabled: false },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "dark",
      style: { fontSize: "12px" },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const month = w.globals.labels[dataPointIndex];
        const present = series[0][dataPointIndex];
        const late = series[1][dataPointIndex];
        const absent = series[2][dataPointIndex];
        const leave = series[3]?.[dataPointIndex] || 0;
        const total = present + late + absent + leave;

        const pct = (val) => (total > 0 ? ((val / total) * 100).toFixed(1) : "0.0");

        return `
          <div style="padding: 12px; min-width: 180px; font-family: inherit;">
            <div style="font-weight: 800; font-size: 13px; margin-bottom: 10px; color: #f8fafc;">
              ${month}
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#10b981;"></span>
              <span style="color:#94a3b8;font-size:11px;min-width:50px;">Present</span>
              <span style="font-weight:700;color:#f8fafc;font-size:12px;min-width:30px;">${Math.round(present)}</span>
              <span style="margin-left:auto;font-weight:600;color:#10b981;font-size:11px;">${pct(present)}%</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;"></span>
              <span style="color:#94a3b8;font-size:11px;min-width:50px;">Late</span>
              <span style="font-weight:700;color:#f8fafc;font-size:12px;min-width:30px;">${Math.round(late)}</span>
              <span style="margin-left:auto;font-weight:600;color:#f59e0b;font-size:11px;">${pct(late)}%</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:5px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#ef4444;"></span>
              <span style="color:#94a3b8;font-size:11px;min-width:50px;">Absent</span>
              <span style="font-weight:700;color:#f8fafc;font-size:12px;min-width:30px;">${Math.round(absent)}</span>
              <span style="margin-left:auto;font-weight:600;color:#ef4444;font-size:11px;">${pct(absent)}%</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#8b5cf6;"></span>
              <span style="color:#94a3b8;font-size:11px;min-width:50px;">Leave</span>
              <span style="font-weight:700;color:#f8fafc;font-size:12px;min-width:30px;">${Math.round(leave)}</span>
              <span style="margin-left:auto;font-weight:600;color:#8b5cf6;font-size:11px;">${pct(leave)}%</span>
            </div>
            <div style="border-top:1px solid #334155;padding-top:8px;display:flex;justify-content:space-between;">
              <span style="color:#94a3b8;font-size:11px;">Total</span>
              <span style="font-weight:800;color:#f8fafc;font-size:12px;">${Math.round(total)} days</span>
            </div>
          </div>
        `;
      },
    },
  };

  // Series uses RAW COUNTS (not percentages)
  const monthlySeries = [
    { name: "Present", data: monthly.map((m) => m.present || 0) },
    { name: "Late", data: monthly.map((m) => m.late || 0) },
    { name: "Absent", data: monthly.map((m) => m.absent || 0) },
    { name: "Leave", data: monthly.map((m) => m.leave || 0) },
  ];

  // ── Weekly Chart ──
  const weeklyOptions = {
    chart: { type: "area", toolbar: { show: false }, fontFamily: "inherit" },
    colors: ["#6366f1"],
    stroke: { curve: "smooth", width: 3 },
    fill: {
      type: "gradient",
      gradient: { shadeIntensity: 1, opacityFrom: 0.35, opacityTo: 0.02, stops: [0, 80, 100] },
    },
    xaxis: {
      categories: weekly.map((w) => {
        const start = new Date(w.week_start);
        return start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }),
      labels: { style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      max: 100,
      labels: { style: { colors: "#94a3b8", fontSize: "11px" }, formatter: (val) => `${Math.round(val)}%` },
    },
    grid: { borderColor: "#f1f5f9", strokeDashArray: 4, padding: { top: 10, right: 10, bottom: 0, left: 10 } },
    dataLabels: { enabled: false },
    markers: { size: 4, colors: ["#fff"], strokeColors: "#6366f1", strokeWidth: 2 },
    tooltip: {
      theme: "dark",
      y: { formatter: (val) => `${Math.round(val)}% attendance` },
    },
  };

  const weeklySeries = [{ name: "Attendance Rate", data: weekly.map((w) => w.percentage || 0) }];

  const hasData = activeTab === "monthly" ? monthly.length > 0 : weekly.length > 0;
  const showWeeklyNav = activeTab === "weekly" && weeklyPagination;

  return (
    <div className="bg-white border border-slate-200/70 rounded-2xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Attendance Trends</h3>
            <p className="text-[11px] text-slate-400">Performance analytics</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {stats && (
            <div className="hidden md:flex items-center gap-2">
              <StatPill icon={Target} label="Present" value={animPresent} trend={4.2} color="emerald" />
              <StatPill icon={Activity} label="Late" value={animLate} trend={-2.1} color="amber" />
              <StatPill icon={TrendingDown} label="Absent" value={animAbsent} trend={-12.5} color="rose" />
              <StatPill icon={Zap} label="Rate" value={animRate} trend={1.8} color="indigo" />
            </div>
          )}

          <div className="flex items-center gap-2">
            <Calendar className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={year}
              onChange={(e) => onYearChange(Number(e.target.value))}
              className="text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between px-5 pt-4">
        <div className="flex items-center gap-1 rounded-xl border border-slate-200/80 bg-slate-50/80 p-0.5">
          <button
            onClick={() => setActiveTab("monthly")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-lg transition-all ${
              activeTab === "monthly" ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5" /> Monthly
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`flex items-center gap-1.5 px-3.5 py-2 text-[11px] font-bold rounded-lg transition-all ${
              activeTab === "weekly" ? "bg-white text-slate-900 shadow-sm ring-1 ring-slate-100" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <LineChart className="h-3.5 w-3.5" /> Weekly
          </button>
        </div>

        {activeTab === "monthly" && (
          <div className="hidden sm:flex items-center gap-3">
            {[
              { label: "Present", color: "bg-emerald-500" },
              { label: "Late", color: "bg-amber-500" },
              { label: "Absent", color: "bg-rose-500" },
              { label: "Leave", color: "bg-violet-500" },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`h-2 w-2 rounded-full ${item.color}`} />
                <span className="text-[10px] font-bold text-slate-400">{item.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="px-2 pb-2 pt-2">
        {hasData ? (
          <Chart
            key={`${activeTab}-${year}`}
            options={activeTab === "monthly" ? monthlyOptions : weeklyOptions}
            series={activeTab === "monthly" ? monthlySeries : weeklySeries}
            type={activeTab === "monthly" ? "bar" : "area"}
            height={300}
          />
        ) : (
          <div className="flex items-center justify-center h-72 text-slate-400 text-sm font-medium">
            No data for {year}
          </div>
        )}
      </div>

      {/* Weekly Pagination */}
      {showWeeklyNav && (
        <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50/50">
          <span className="text-[11px] text-slate-400 font-medium">
            {weeklyPagination.count} weeks total
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onWeeklyPrev}
              disabled={!weeklyPagination.previous}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[11px] font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="h-3.5 w-3.5" /> Prev
            </button>
            <button
              onClick={onWeeklyNext}
              disabled={!weeklyPagination.next}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 text-[11px] font-bold hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              Next <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}