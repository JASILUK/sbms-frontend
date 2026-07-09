import React from "react";
import PropTypes from "prop-types";

function SummaryStatCard({ label, value, colorClass, bgClass }) {
  return (
    <div className="bg-white p-5 border border-slate-200 rounded-2xl shadow-xs flex flex-col justify-between">
      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">{label}</span>
      <div className="flex items-baseline justify-between mt-2">
        <span className="text-2xl font-bold font-mono tracking-tight text-slate-800">{value}</span>
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md uppercase font-sans ${bgClass} ${colorClass}`}>
          Anomaly
        </span>
      </div>
    </div>
  );
}

SummaryStatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  colorClass: PropTypes.string.isRequired,
  bgClass: PropTypes.string.isRequired,
};

export const ReviewDashboardCards = React.memo(({ metrics }) => {
  if (!metrics) return null;

  return (
    <section className="grid grid-cols-2 lg:grid-cols-6 gap-4 w-full" aria-label="Anomaly distribution telemetry matrix">
      <SummaryStatCard label="Pending Action" value={metrics.review_count || 0} colorClass="text-red-700" bgClass="bg-red-50" />
      <SummaryStatCard label="Today's Triggers" value={metrics.today_review_count || 0} colorClass="text-amber-700" bgClass="bg-amber-50" />
      <SummaryStatCard label="Missing Checkout" value={metrics.missing_checkout_count || 0} colorClass="text-rose-700" bgClass="bg-rose-50" />
      <SummaryStatCard label="System Closures" value={metrics.auto_closed_count || 0} colorClass="text-blue-700" bgClass="bg-blue-50" />
      <SummaryStatCard label="Duplicate Punch" value={metrics.duplicate_punches_count || 0} colorClass="text-orange-700" bgClass="bg-orange-50" />
      <SummaryStatCard label="Unresolved Logs" value={metrics.unresolved_count || 0} colorClass="text-slate-600" bgClass="bg-slate-100" />
    </section>
  );
});

ReviewDashboardCards.displayName = "ReviewDashboardCards";
ReviewDashboardCards.propTypes = {
  metrics: PropTypes.object,
};