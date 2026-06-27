import React from "react";
import Chart from "react-apexcharts";

// ─── Circular Ring (SVG) ─────────────────────────────────────────────────────
function CircularRing({ value, max, color, size = 52, strokeWidth = 5 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  const offset = circumference - (pct / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#f1f5f9" strokeWidth={strokeWidth} strokeLinecap="round" />
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
          strokeDasharray={circumference} strokeDashoffset={offset} className="transition-all duration-700 ease-out" />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-slate-700">{Math.round(pct)}%</span>
    </div>
  );
}

// ─── Mini Sparkline ────────────────────────────────────────────────────────────
function MiniSparkline({ color, data }) {
  const safeData = Array.isArray(data) && data.length > 0 ? data : [0, 0, 0, 0, 0, 0, 0];
  const options = {
    chart: { type: "area", sparkline: { enabled: true }, animations: { enabled: true, speed: 600 } },
    stroke: { curve: "smooth", width: 1.5 },
    fill: { type: "gradient", gradient: { shadeIntensity: 1, opacityFrom: 0.25, opacityTo: 0.03, stops: [0, 90] } },
    colors: [color],
    tooltip: { enabled: false },
  };
  return <Chart options={options} series={[{ name: "trend", data: safeData }]} type="area" height={28} width={64} />;
}

// ─── Summary Card ──────────────────────────────────────────────────────────────
export default function SummaryCard({ title, value, subText, icon: Icon, color, textColor, bg, ringMax, sparklineData, trendLabel }) {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  return (
    <div className="group bg-white border border-slate-200/70 rounded-2xl p-5 flex flex-col shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-0.5">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{title}</span>
          <p className="text-2xl font-black text-slate-900 tracking-tight">{value}</p>
        </div>
        <div className={`p-2.5 rounded-xl border ${bg} transition-transform duration-300 group-hover:scale-110`}>
          <Icon className={`h-5 w-5 ${textColor}`} strokeWidth={2.2} />
        </div>
      </div>

      <div className="flex items-center gap-4 py-3 border-y border-slate-50">
        <CircularRing value={numericValue} max={ringMax} color={color} size={56} strokeWidth={5} />
        <div className="space-y-1 flex-1 min-w-0">
          <p className="text-[11px] font-semibold text-slate-600">{trendLabel}</p>
          <p className="text-[10px] text-slate-400 leading-relaxed">{subText}</p>
        </div>
      </div>

      <div className="flex items-center justify-between pt-3 mt-1">
        <span className="text-[9px] text-slate-400 font-medium uppercase tracking-wider">Last 7 days</span>
        <MiniSparkline color={color} data={sparklineData} />
      </div>
    </div>
  );
}