import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

export const WorkforceDoughnutChart = React.memo(({ summary }) => {
  if (!summary) return null;

  const chartData = [
    { key: 'working', label: 'Working', color: '#10b981' },
    { key: 'break', label: 'On Break', color: '#f59e0b' },
    { key: 'checked_out', label: 'Checked Out', color: '#3b82f6' },
    { key: 'leave', label: 'On Leave', color: '#a855f7' },
    { key: 'absent', label: 'Absent', color: '#ef4444' },
    { key: 'not_started', label: 'Not Started', color: '#64748b' },
  ];

  const activeData = chartData
    .map((item) => ({ ...item, value: summary[item.key] || 0 }))
    .filter((item) => item.value > 0);

  const categories = activeData.length > 0 ? activeData.map((d) => d.label) : chartData.map((d) => d.label);
  const values = activeData.length > 0 ? activeData.map((d) => d.value) : chartData.map(() => 0);
  const colors = activeData.length > 0 ? activeData.map((d) => d.color) : chartData.map((d) => d.color);

  const options = {
    chart: {
      type: 'donut',
      animations: {
        enabled: true,
        easing: 'easeinout',
        speed: 800,
        animateGradually: { enabled: true, delay: 150 },
        dynamicAnimation: { enabled: true, speed: 350 },
      },
      dropShadow: { enabled: true, top: 2, left: 2, blur: 4, opacity: 0.08 },
    },
    labels: categories,
    colors: colors,
    stroke: { width: 3, colors: ['#ffffff'] },
    dataLabels: { enabled: false },
    legend: {
      position: 'bottom',
      fontSize: '12px',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontWeight: 500,
      labels: { colors: '#475569' },
      markers: { radius: 4, width: 8, height: 8 },
      itemMargin: { horizontal: 10, vertical: 4 },
    },
    tooltip: {
      theme: 'light',
      style: { fontSize: '12px', fontFamily: 'Inter, system-ui, sans-serif' },
      y: { formatter: (val) => `${val} employee${val !== 1 ? 's' : ''}` },
    },
    plotOptions: {
      pie: {
        donut: {
          size: '72%',
          labels: {
            show: true,
            name: { show: true, fontSize: '11px', fontFamily: 'Inter, system-ui, sans-serif', color: '#94a3b8', offsetY: -4 },
            value: { show: true, fontSize: '28px', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 700, color: '#0f172a', offsetY: 4 },
            total: { show: true, showAlways: true, label: 'Scheduled', fontSize: '11px', fontFamily: 'Inter, system-ui, sans-serif', fontWeight: 600, color: '#94a3b8', formatter: () => summary.total || 0 },
          },
        },
      },
    },
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between min-h-[380px] animate-fade-in-up">
      <div className="mb-2">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workforce Roster Allocation</h3>
        <p className="text-xs text-slate-500 font-medium mt-1">Live status distribution across all employees</p>
      </div>
      <div className="flex-1 flex items-center justify-center py-2">
        <Chart options={options} series={values} type="donut" height={260} width="100%" />
      </div>
    </div>
  );
});

WorkforceDoughnutChart.displayName = "WorkforceDoughnutChart";
WorkforceDoughnutChart.propTypes = { summary: PropTypes.object };