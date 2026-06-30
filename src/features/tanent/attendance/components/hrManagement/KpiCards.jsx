import React from "react";
import { Users, UserCheck, UserX, Clock, TrendingUp } from "lucide-react";
import StatCard from "./StatCard";
import { KpiCardSkeleton } from "./Skeletons";

/**
 * Top-of-page KPI strip. Reads from dashboard-summary response.
 * Field names follow AttendanceStatisticsSerializer; adjust the
 * `summary.<field>` accessors below if your backend nests differently.
 */
export default function KpiCards({ summary, isLoading }) {
  if (isLoading || !summary) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <KpiCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  const cards = [
    {
      icon: Users,
      title: "Total Employees",
      value: summary.total_records ?? 0,
      description: "Tracked today",
      color: "indigo",
    },
    {
      icon: UserCheck,
      title: "Present",
      value: summary.present_count ?? 0,
      description: `${summary.attendance_percentage ?? 0}% attendance`,
      color: "emerald",
    },
    {
      icon: UserX,
      title: "Absent",
      value: summary.absent_count ?? 0,
      description: `${summary.leave_count ?? 0} on leave`,
      color: "rose",
    },
    {
      icon: Clock,
      title: "Needs Review",
      value: summary.review_required_count ?? 0,
      description: `${summary.late_count ?? 0} late check-ins`,
      color: "amber",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, i) => (
        <StatCard key={card.title} index={i} {...card} />
      ))}
    </div>
  );
}
