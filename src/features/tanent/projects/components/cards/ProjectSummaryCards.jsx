import React from "react";
import { FolderKanban, CheckCircle2, Clock, Archive } from "lucide-react";

export const ProjectSummaryCards = ({ summary = {}, isLoading }) => {
  const cards = [
    {
      title: "Total Projects",
      value: summary.total_projects ?? 0,
      icon: FolderKanban,
      iconStyle: "bg-indigo-50 border-indigo-100 text-indigo-600",
    },
    {
      title: "Active Projects",
      value: summary.active_projects ?? 0,
      icon: Clock,
      iconStyle: "bg-emerald-50 border-emerald-100 text-emerald-600",
    },
    {
      title: "Completed",
      value: summary.completed_projects ?? 0,
      icon: CheckCircle2,
      iconStyle: "bg-blue-50 border-blue-100 text-blue-600",
    },
    {
      title: "Archived",
      value: summary.archived_projects ?? 0,
      icon: Archive,
      iconStyle: "bg-slate-100 border-slate-200 text-slate-600",
    },
  ];

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-24 rounded-xl bg-white border border-slate-200/80 animate-pulse p-5 flex items-center justify-between shadow-sm"
          >
            <div className="space-y-2">
              <div className="h-3 w-20 bg-slate-200 rounded" />
              <div className="h-7 w-12 bg-slate-200 rounded" />
            </div>
            <div className="w-11 h-11 rounded-lg bg-slate-100 shrink-0" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.title}
            className="p-5 rounded-xl bg-white border border-slate-200/80 shadow-sm flex items-center justify-between transition-shadow duration-200 hover:shadow-md"
          >
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </p>
              <h3 className="text-2xl font-bold text-slate-900 tracking-tight">
                {card.value}
              </h3>
            </div>

            <div
              className={`p-2.5 rounded-lg border shrink-0 ${card.iconStyle}`}
            >
              <Icon className="w-5 h-5" />
            </div>
          </div>
        );
      })}
    </div>
  );
};