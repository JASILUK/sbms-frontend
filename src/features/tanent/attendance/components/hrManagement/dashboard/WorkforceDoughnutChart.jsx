import React from 'react';
import PropTypes from 'prop-types';
import Chart from 'react-apexcharts';

export const WorkforceDoughnutChart = React.memo(({ summary }) => {
  if (!summary) return null;

  const categories = ["Working Onsite", "On Break Intervals", "Checked Out", "Approved Leaves", "Absent Frame", "Future Shifts"];
  const values = [
    summary.currently_working || 0,
    summary.on_break || 0,
    summary.checked_out || 0,
    summary.leave_today || 0,
    summary.absent_until_now || 0,
    summary.shift_not_started_yet || 0,
  ];

  const options = {
    chart: { type: 'donut' },
    labels: categories,
    colors: ["#10b981", "#f59e0b", "#3b82f6", "#a855f7", "#ef4444", "#64748b"],
    stroke: { width: 2, colors: ["#fff"] },
    dataLabels: { enabled: false },
    legend: { position: 'bottom', fontSize: '11px', fontFamily: 'sans-serif', labels: { colors: '#475569' } },
    plotOptions: {
      pie: {
        donut: {
          size: '70%',
          labels: {
            show: true,
            total: { show: true, label: 'Scheduled Total', fontSize: '11px', color: '#94a3b8', formatter: () => summary.scheduled_today || 0 }
          }
        }
      }
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs flex flex-col justify-between min-h-[360px]">
      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workforce Roster Allocation</h3>
        <p className="text-xs text-slate-500 font-semibold mt-0.5">Live status evaluation matrix distribution</p>
      </div>
      <div className="py-2">
        <Chart options={options} series={values} type="donut" height={240} />
      </div>
    </div>
  );
});

WorkforceDoughnutChart.displayName = "WorkforceDoughnutChart";
WorkforceDoughnutChart.propTypes = {
  summary: PropTypes.object,
};