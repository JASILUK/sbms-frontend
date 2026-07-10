import React, { memo, useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  Legend,
  Area,
  AreaChart,
} from "recharts";
import { CHART_COLORS } from "../../../constants/hrAttendance";

// ------------------------------------------------------------------------------
// Status Distribution — Donut Chart
// ------------------------------------------------------------------------------
const StatusDistributionChart = memo(({ data }) => {
  const chartData = useMemo(() => {
    if (!data || !Array.isArray(data)) return [];
    return data.filter((item) => item.count > 0);
  }, [data]);

  const colorMap = {
    PRESENT: CHART_COLORS.present,
    ABSENT: CHART_COLORS.absent,
    HALF_DAY: CHART_COLORS.halfDay,
    LEAVE: CHART_COLORS.leave,
    HOLIDAY: CHART_COLORS.holiday,
    WEEKEND: CHART_COLORS.weekend,
    INCOMPLETE: CHART_COLORS.incomplete,
    REVIEW_REQUIRED: CHART_COLORS.reviewRequired,
  };

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-slate-400">
        No distribution data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={90}
          paddingAngle={3}
          dataKey="count"
          nameKey="label"
          stroke="none"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorMap[entry.status] || CHART_COLORS.slate}
            />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
          formatter={(value, name) => [value, name]}
        />
        <Legend
          verticalAlign="bottom"
          height={36}
          iconType="circle"
          iconSize={8}
          formatter={(value) => (
            <span style={{ fontSize: "11px", color: "#475569" }}>{value}</span>
          )}
        />
      </PieChart>
    </ResponsiveContainer>
  );
});

StatusDistributionChart.displayName = "StatusDistributionChart";

// ------------------------------------------------------------------------------
// Trend Line Chart — Reusable
// ------------------------------------------------------------------------------
const TrendLineChart = memo(({ data, dataKeys, colors, yAxisLabel }) => {
  if (!data || !data.length) {
    return (
      <div className="flex items-center justify-center h-56 text-sm text-slate-400">
        No trend data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <defs>
          {dataKeys.map((key, i) => (
            <linearGradient key={key} id={`grad-${key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={colors[i]} stopOpacity={0.15} />
              <stop offset="95%" stopColor={colors[i]} stopOpacity={0} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
          tickFormatter={(value) => {
            if (!value) return "";
            const d = new Date(value);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        {dataKeys.map((key, i) => (
          <Area
            key={key}
            type="monotone"
            dataKey={key}
            stroke={colors[i]}
            strokeWidth={2}
            fill={`url(#grad-${key})`}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
});

TrendLineChart.displayName = "TrendLineChart";

// ------------------------------------------------------------------------------
// Weekly/Monthly Bar Chart — Reusable
// ------------------------------------------------------------------------------
const PeriodBarChart = memo(({ data, dataKey, color, label }) => {
  if (!data || !data.length) {
    return (
      <div className="flex items-center justify-center h-56 text-sm text-slate-400">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
        <XAxis
          dataKey={data.length > 0 && data[0].week_starting ? "week_starting" : "month"}
          tick={{ fontSize: 10, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={{ stroke: "#e2e8f0" }}
          tickFormatter={(value) => {
            if (!value) return "";
            const d = new Date(value);
            return `${d.getMonth() + 1}/${d.getDate()}`;
          }}
        />
        <YAxis
          tick={{ fontSize: 11, fill: "#94a3b8" }}
          tickLine={false}
          axisLine={false}
          width={40}
        />
        <Tooltip
          contentStyle={{
            background: "#fff",
            border: "1px solid #e2e8f0",
            borderRadius: "8px",
            fontSize: "12px",
            boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
          }}
        />
        <Bar
          dataKey={dataKey}
          fill={color}
          radius={[4, 4, 0, 0]}
          maxBarSize={40}
        />
      </BarChart>
    </ResponsiveContainer>
  );
});

PeriodBarChart.displayName = "PeriodBarChart";

// ------------------------------------------------------------------------------
// Main Charts Section
// ------------------------------------------------------------------------------
const AttendanceChartsSection = memo(({ charts }) => {
  const {
    status_distribution,
    daily,
    weekly,
    monthly,
    late_trend,
    work_hours_trend,
    overtime_trend,
  } = charts || {};

  return (
    <section aria-label="Attendance analytics charts">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Status Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Status Distribution
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Breakdown of attendance statuses in selected period
          </p>
          <StatusDistributionChart data={status_distribution} />
        </div>

        {/* Work Hours Trend */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Work Hours Trend
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Daily work and break hours over time
          </p>
          <TrendLineChart
            data={work_hours_trend}
            dataKeys={["work_hours", "break_hours"]}
            colors={[CHART_COLORS.workHours, CHART_COLORS.break]}
          />
        </div>

        {/* Weekly Attendance */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Weekly Overview
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Work hours aggregated by week
          </p>
          <PeriodBarChart
            data={weekly}
            dataKey="total_work_hours"
            color={CHART_COLORS.workHours}
          />
        </div>

        {/* Monthly Attendance */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Monthly Overview
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Work hours aggregated by month
          </p>
          <PeriodBarChart
            data={monthly}
            dataKey="total_work_hours"
            color={CHART_COLORS.workHours}
          />
        </div>

        {/* Late Trend */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Late Trend
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Late minutes and occurrences over time
          </p>
          <TrendLineChart
            data={late_trend}
            dataKeys={["late_minutes"]}
            colors={[CHART_COLORS.late]}
          />
        </div>

        {/* Overtime Trend */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-1">
            Overtime Trend
          </h3>
          <p className="text-xs text-slate-400 mb-3">
            Overtime hours and occurrences over time
          </p>
          <TrendLineChart
            data={overtime_trend}
            dataKeys={["overtime_hours"]}
            colors={[CHART_COLORS.overtime]}
          />
        </div>
      </div>
    </section>
  );
});

AttendanceChartsSection.displayName = "AttendanceChartsSection";

export default AttendanceChartsSection;