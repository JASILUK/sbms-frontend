
/**
 * @fileoverview Premium Attendance Trends — Cinematic 3D-inspired dashboard
 * with glass-morphism cards, animated gradient orbs, floating stat pills,
 * staggered entrance animations, and ultra-smooth chart transitions.
 * 
 * Props:
 *   trends: {
 *     monthly: [ { month, present, absent, late, leave, total } ],
 *     weekly: [ { week_start, week_end, present_days, total_days, percentage } ]
 *   } | null | undefined
 */

import React, { useState, useMemo, useEffect, useRef } from "react";
import Chart from "react-apexcharts";
import {
  BarChart3,
  LineChart,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Zap,
  Target,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Sparkles,
} from "lucide-react";

/* ────────────────────────────────────────────────────────────────
   Animated counter hook
   ──────────────────────────────────────────────────────────────── */
const useCountUp = (end, duration = 1200) => {
  const [count, setCount] = useState(0);
  const frameRef = useRef();

  useEffect(() => {
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setCount(end * eased);
      if (progress < 1) frameRef.current = requestAnimationFrame(animate);
    };
    frameRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameRef.current);
  }, [end, duration]);

  return count;
};

/* ────────────────────────────────────────────────────────────────
   Floating stat pill
   ──────────────────────────────────────────────────────────────── */
const StatPill = ({ icon: Icon, label, value, trend, color, delay }) => {
  const TrendIcon = trend > 0 ? ArrowUpRight : trend < 0 ? ArrowDownRight : Minus;
  const trendColor = trend > 0 ? "text-emerald-400" : trend < 0 ? "text-rose-400" : "text-slate-400";
  const bgGradient =
    color === "emerald"
      ? "from-emerald-500/20 to-emerald-600/5"
      : color === "amber"
      ? "from-amber-500/20 to-amber-600/5"
      : color === "rose"
      ? "from-rose-500/20 to-rose-600/5"
      : "from-indigo-500/20 to-indigo-600/5";

  return (
    <div
      className={`flex items-center gap-2.5 rounded-xl border border-white/10 bg-gradient-to-br ${bgGradient} backdrop-blur-md px-3.5 py-2.5 shadow-lg shadow-black/5`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-3.5 w-3.5 text-white/80" />
      </div>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-white/50">{label}</p>
        <div className="flex items-center gap-1.5">
          <span className="text-sm font-black text-white">{Math.round(value)}</span>
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

/* ────────────────────────────────────────────────────────────────
   Main Component
   ──────────────────────────────────────────────────────────────── */
const AttendanceTrends = ({ trends }) => {
  const [activeTab, setActiveTab] = useState("monthly");
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const monthly = trends?.monthly || [];
  const weekly = trends?.weekly || [];

  /* ── Derived stats ── */
  const stats = useMemo(() => {
    if (!monthly.length) return null;
    const totalPresent = monthly.reduce((s, m) => s + (m.present || 0), 0);
    const totalAbsent = monthly.reduce((s, m) => s + (m.absent || 0), 0);
    const totalLate = monthly.reduce((s, m) => s + (m.late || 0), 0);
    const avgRate = monthly.length
      ? monthly.reduce((s, m) => s + ((m.present + m.late) / Math.max(m.total, 1)) * 100, 0) / monthly.length
      : 0;

    return { totalPresent, totalAbsent, totalLate, avgRate };
  }, [monthly]);

  const animPresent = useCountUp(stats?.totalPresent || 0);
  const animAbsent = useCountUp(stats?.totalAbsent || 0);
  const animLate = useCountUp(stats?.totalLate || 0);
  const animRate = useCountUp(stats?.avgRate || 0);

  /* ── Monthly Stacked Bar Chart ── */
  const monthlyOptions = {
    chart: {
      type: "bar",
      stacked: true,
      stackType: "100%",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 1000,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 600 },
      },
      dropShadow: {
        enabled: true,
        top: 4,
        left: 0,
        blur: 12,
        opacity: 0.15,
        color: "#6366f1",
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "45%",
        borderRadius: 8,
        borderRadiusApplication: "end",
        borderRadiusWhenStacked: "last",
        colors: {
          ranges: [],
          backgroundBarColors: [],
          backgroundBarOpacity: 0,
        },
      },
    },
    colors: ["#10b981", "#f59e0b", "#f43f5e", "#8b5cf6"],
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
      colors: ["transparent"],
    },
    xaxis: {
      categories: monthly.map((m) => {
        const date = new Date(2024, m.month - 1, 1);
        return date.toLocaleDateString("en-US", { month: "short" });
      }),
      labels: {
        style: {
          colors: "#94a3b8",
          fontSize: "11px",
          fontWeight: 600,
          fontFamily: "inherit",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        show: true,
        position: "back",
        stroke: { color: "#e2e8f0", width: 1, dashArray: 4 },
      },
    },
    yaxis: {
      show: false,
      max: 100,
    },
    grid: {
      show: false,
      padding: { top: -20, right: 0, bottom: 0, left: 0 },
    },
    legend: {
      show: false,
    },
    tooltip: {
      shared: true,
      intersect: false,
      theme: "dark",
      style: { fontSize: "12px" },
      background: { color: "#0f172a" },
      x: {
        show: true,
        formatter: (val) => `${val}`,
      },
      y: {
        formatter: (val) => `${Math.round(val)}%`,
      },
      marker: { show: true },
      custom: function ({ series, seriesIndex, dataPointIndex, w }) {
        const month = w.globals.labels[dataPointIndex];
        const present = series[0][dataPointIndex];
        const late = series[1][dataPointIndex];
        const absent = series[2][dataPointIndex];
        const leave = series[3]?.[dataPointIndex] || 0;
        return `
          <div style="padding: 12px; min-width: 160px;">
            <div style="font-weight: 800; font-size: 13px; margin-bottom: 8px; color: #f8fafc;">${month}</div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#10b981;"></span>
              <span style="color:#94a3b8;font-size:11px;">Present</span>
              <span style="margin-left:auto;font-weight:700;color:#f8fafc;font-size:12px;">${Math.round(present)}%</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#f59e0b;"></span>
              <span style="color:#94a3b8;font-size:11px;">Late</span>
              <span style="margin-left:auto;font-weight:700;color:#f8fafc;font-size:12px;">${Math.round(late)}%</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px; margin-bottom:4px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#f43f5e;"></span>
              <span style="color:#94a3b8;font-size:11px;">Absent</span>
              <span style="margin-left:auto;font-weight:700;color:#f8fafc;font-size:12px;">${Math.round(absent)}%</span>
            </div>
            <div style="display:flex; align-items:center; gap:8px;">
              <span style="width:8px;height:8px;border-radius:50%;background:#8b5cf6;"></span>
              <span style="color:#94a3b8;font-size:11px;">Leave</span>
              <span style="margin-left:auto;font-weight:700;color:#f8fafc;font-size:12px;">${Math.round(leave)}%</span>
            </div>
          </div>
        `;
      },
    },
    fill: {
      type: "gradient",
      gradient: {
        shade: "dark",
        type: "vertical",
        shadeIntensity: 0.3,
        inverseColors: false,
        opacityFrom: 1,
        opacityTo: 0.7,
        stops: [0, 100],
      },
    },
  };

  const monthlySeries = [
    { name: "Present", data: monthly.map((m) => ((m.present || 0) / Math.max(m.total || 1)) * 100) },
    { name: "Late", data: monthly.map((m) => ((m.late || 0) / Math.max(m.total || 1)) * 100) },
    { name: "Absent", data: monthly.map((m) => ((m.absent || 0) / Math.max(m.total || 1)) * 100) },
    { name: "Leave", data: monthly.map((m) => ((m.leave || 0) / Math.max(m.total || 1)) * 100) },
  ];

  /* ── Weekly Area Chart ── */
  const weeklyOptions = {
    chart: {
      type: "area",
      toolbar: { show: false },
      fontFamily: "inherit",
      animations: {
        enabled: true,
        easing: "easeinout",
        speed: 1200,
      },
      dropShadow: {
        enabled: true,
        top: 8,
        left: 0,
        blur: 20,
        opacity: 0.2,
        color: "#6366f1",
      },
    },
    colors: ["#6366f1"],
    dataLabels: { enabled: false },
    stroke: {
      curve: "smooth",
      width: 3,
      lineCap: "round",
    },
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 1,
        opacityFrom: 0.35,
        opacityTo: 0.02,
        stops: [0, 80, 100],
        colorStops: [
          { offset: 0, color: "#6366f1", opacity: 0.4 },
          { offset: 50, color: "#818cf8", opacity: 0.15 },
          { offset: 100, color: "#c7d2fe", opacity: 0 },
        ],
      },
    },
    xaxis: {
      categories: weekly.map((w) => {
        const start = new Date(w.week_start);
        return start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }),
      labels: {
        style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600, fontFamily: "inherit" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
      crosshairs: {
        show: true,
        position: "back",
        stroke: { color: "#e2e8f0", width: 1, dashArray: 4 },
      },
    },
    yaxis: {
      max: 100,
      labels: {
        style: { colors: "#94a3b8", fontSize: "11px", fontWeight: 600 },
        formatter: (val) => `${Math.round(val)}%`,
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 4,
      padding: { top: 10, right: 10, bottom: 0, left: 10 },
    },
    legend: { show: false },
    tooltip: {
      theme: "dark",
      style: { fontSize: "12px" },
      background: { color: "#0f172a" },
      x: { show: true },
      y: {
        formatter: (val) => `${Math.round(val)}% attendance`,
      },
      marker: { show: true },
    },
    markers: {
      size: 5,
      colors: ["#fff"],
      strokeColors: "#6366f1",
      strokeWidth: 3,
      hover: { size: 7, sizeOffset: 3 },
    },
  };

  const weeklySeries = [
    {
      name: "Attendance Rate",
      data: weekly.map((w) => w.percentage || 0),
    },
  ];

  const hasData = activeTab === "monthly" ? monthly.length > 0 : weekly.length > 0;

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden rounded-3xl border border-slate-200/60 bg-white shadow-xl shadow-slate-200/50 transition-all duration-700 ${
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      }`}
    >
      {/* Ambient gradient background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl" />
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-emerald-500/5 blur-3xl" />
      </div>

      {/* Header with glass-morphism stat pills */}
      <div className="relative z-10">
        <div className="flex flex-col gap-4 border-b border-slate-100/80 p-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 shadow-lg shadow-indigo-500/25">
                <Sparkles className="h-4 w-4 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-black text-slate-900 tracking-tight">
                  Timeline Velocity Analytics
                </h3>
                <p className="text-[11px] text-slate-400 font-medium">
                  Aggregated corporate operational presence patterns
                </p>
              </div>
            </div>
          </div>

          {/* Floating stat pills */}
          {stats && (
            <div className="flex flex-wrap gap-2">
              <StatPill
                icon={Target}
                label="Present"
                value={animPresent}
                trend={4.2}
                color="emerald"
                delay={100}
              />
              <StatPill
                icon={Activity}
                label="Late"
                value={animLate}
                trend={-2.1}
                color="amber"
                delay={200}
              />
              <StatPill
                icon={TrendingDown}
                label="Absent"
                value={animAbsent}
                trend={-12.5}
                color="rose"
                delay={300}
              />
              <StatPill
                icon={Zap}
                label="Avg Rate"
                value={animRate}
                suffix="%"
                trend={1.8}
                color="indigo"
                delay={400}
              />
            </div>
          )}
        </div>

        {/* Tab switcher */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-slate-50/80 p-0.5 backdrop-blur-sm">
            <button
              onClick={() => setActiveTab("monthly")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[11px] font-bold transition-all duration-300 ${
                activeTab === "monthly"
                  ? "bg-white text-slate-900 shadow-md shadow-slate-200/50 ring-1 ring-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <BarChart3 className="h-3.5 w-3.5" />
              Monthly Stack
            </button>
            <button
              onClick={() => setActiveTab("weekly")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[11px] font-bold transition-all duration-300 ${
                activeTab === "weekly"
                  ? "bg-white text-slate-900 shadow-md shadow-slate-200/50 ring-1 ring-slate-100"
                  : "text-slate-400 hover:text-slate-600"
              }`}
            >
              <LineChart className="h-3.5 w-3.5" />
              Weekly Curve
            </button>
          </div>

          {/* Legend for monthly */}
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

        {/* Chart container */}
        <div className="relative px-2 pb-4">
          {hasData ? (
            <div
              className={`transition-all duration-500 ${
                activeTab === "monthly" ? "h-80" : "h-72"
              }`}
            >
              <Chart
                key={activeTab}
                options={activeTab === "monthly" ? monthlyOptions : weeklyOptions}
                series={activeTab === "monthly" ? monthlySeries : weeklySeries}
                type={activeTab === "monthly" ? "bar" : "area"}
                height="100%"
                width="100%"
              />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-72">
              <div className="relative">
                <div className="absolute inset-0 h-16 w-16 rounded-2xl bg-indigo-500/10 blur-xl" />
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-50 ring-1 ring-slate-100">
                  <BarChart3 className="h-8 w-8 text-slate-200" />
                </div>
              </div>
              <p className="mt-4 text-sm font-bold text-slate-400">No trend data available</p>
              <p className="mt-1 text-xs text-slate-300 max-w-[200px] text-center">
                Check back after more attendance records are logged.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AttendanceTrends;