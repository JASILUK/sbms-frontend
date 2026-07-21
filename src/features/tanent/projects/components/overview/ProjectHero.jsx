import React from "react";
import { Calendar, User, Info, Briefcase } from "lucide-react";

/**
 * Safely formats date strings into human-readable text.
 */
const formatDate = (dateString) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const ProjectHero = ({ project }) => {
  if (!project) return null;

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm space-y-6 mb-6">
      {/* Project Description Section */}
      {project.description ? (
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            Description & Scope
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed max-w-4xl whitespace-pre-line">
            {project.description}
          </p>
        </div>
      ) : (
        <p className="text-xs text-slate-400 italic">No description available for this project.</p>
      )}

      {/* Metadata Detail Badges Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-5 border-t border-slate-100">
        
        {/* Project Owner */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-100 text-indigo-600 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Project Owner
            </p>
            <p className="text-xs font-extrabold text-slate-900 mt-0.5 truncate">
              {project.owner?.name || "Unassigned"}
            </p>
            {project.owner?.email && (
              <p className="text-[11px] text-slate-500 truncate">{project.owner.email}</p>
            )}
          </div>
        </div>

        {/* Project Timeline */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-600 shrink-0">
            <Calendar className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Timeline
            </p>
            <p className="text-xs font-extrabold text-slate-900 mt-0.5">
              {formatDate(project.start_date)} — {formatDate(project.end_date)}
            </p>
          </div>
        </div>

        {/* Client Organization */}
        <div className="flex items-center gap-3 p-3.5 rounded-xl bg-slate-50/80 border border-slate-100">
          <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
            <Briefcase className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Client Context
            </p>
            <p className="text-xs font-extrabold text-slate-900 mt-0.5 truncate">
              {project.client_company || project.client_name || "Internal Project"}
            </p>
            {project.client_email && (
              <p className="text-[11px] text-slate-500 truncate">{project.client_email}</p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};