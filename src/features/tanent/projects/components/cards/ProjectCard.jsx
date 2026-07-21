import React from "react";
import { Link } from "react-router-dom";
import { Calendar, Users, ArrowUpRight, Building2 } from "lucide-react";
import { StatusBadge } from "../shared/StatusBadge";
import { VisibilityBadge } from "../shared/VisibilityBadge";

/**
 * Native date formatter helper for consistent rendering
 */
const formatDate = (dateString) => {
  if (!dateString) return "TBD";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const ProjectCard = ({ project }) => {
  // Safety guard against undefined or null project prop
  if (!project) return null;

  return (
    <div className="group relative rounded-2xl bg-white border border-slate-200/80 p-5 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between">
      <div>
        {/* 1. Header: Project Color, Code & Badges */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2 min-w-0">
            <span
              className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm"
              style={{ backgroundColor: project.color || "#6366F1" }}
            />
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500 bg-slate-100 border border-slate-200/60 px-2 py-0.5 rounded-md truncate">
              {project.code || "PRJ"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <VisibilityBadge visibility={project.visibility} />
            <StatusBadge status={project.status} />
          </div>
        </div>

        {/* 2. Project Title & Navigation Link */}
        <Link
          to={`/app/projects/${project.id}`}
          className="block group/link"
        >
          <h3 className="text-base font-bold text-slate-900 group-hover/link:text-indigo-600 transition-colors flex items-center justify-between gap-2 leading-snug">
            <span className="line-clamp-1">{project.name || "Untitled Project"}</span>
            <ArrowUpRight className="w-4 h-4 text-slate-400 group-hover/link:text-indigo-600 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-all shrink-0" />
          </h3>
        </Link>

        {/* 3. Optional Client Context */}
        {project.client_company && (
          <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              Client: <strong className="text-slate-700 font-semibold">{project.client_company}</strong>
            </span>
          </div>
        )}
      </div>

      {/* 4. Footer Metadata */}
      <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{project.member_count ?? 0} {project.member_count === 1 ? "Member" : "Members"}</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{formatDate(project.start_date)}</span>
        </div>
      </div>
    </div>
  );
};