import React, { useState } from "react";
import { useProjects } from "../hooks/useProjects";
import { ProjectSummaryCards } from "../components/cards/ProjectSummaryCards";
import { ProjectCard } from "../components/cards/ProjectCard";
import { CreateProjectDialog } from "../components/dialogs/CreateProjectDialog";
import { Plus, Search, FolderPlus, Filter } from "lucide-react";

export default function ProjectsListPage() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const {
    projects,
    summary,
    currentFilters,
    isLoading,
    updateFilter,
  } = useProjects();

  const statusOptions = [
    { label: "All Projects", value: "" },
    { label: "Planning", value: "planning" },
    { label: "Active", value: "active" },
    { label: "On Hold", value: "on_hold" },
    { label: "Completed", value: "completed" },
  ];

  return (
    <div className="space-y-6">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Projects
          </h1>
          <p className="text-xs font-medium text-slate-500 mt-1">
            Manage, organize, and track company workspace initiatives.
          </p>
        </div>
        <button
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all duration-150 active:scale-[0.98] shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* 2. Top Summary Metrics */}
      <ProjectSummaryCards summary={summary} isLoading={isLoading} />

      {/* 3. Search Bar & Status Filter Chips */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm space-y-3 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, code, or client..."
            value={currentFilters.search || ""}
            onChange={(e) => updateFilter("search", e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50/80 border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pt-1 sm:pt-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 mr-1 hidden lg:block" />
          {statusOptions.map((opt) => {
            const isActive = (currentFilters.status || "") === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => updateFilter("status", opt.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "bg-slate-100/80 text-slate-600 hover:bg-slate-200/70 hover:text-slate-900"
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Projects Grid / Skeletons / Empty State */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="h-44 bg-white border border-slate-200/80 rounded-2xl p-5 animate-pulse space-y-4 shadow-sm"
            >
              <div className="flex justify-between items-center">
                <div className="h-4 w-24 bg-slate-200 rounded" />
                <div className="h-5 w-16 bg-slate-200 rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-slate-200 rounded" />
              <div className="pt-4 border-t border-slate-100 flex justify-between">
                <div className="h-4 w-20 bg-slate-200 rounded" />
                <div className="h-4 w-20 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200/80 rounded-2xl p-8 shadow-sm max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <FolderPlus className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No Projects Found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto leading-relaxed">
            {currentFilters.search || currentFilters.status
              ? "No project matches your active search filters. Try clearing your filters."
              : "Get started by creating your organization's first workspace project."}
          </p>
          {!(currentFilters.search || currentFilters.status) && (
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-5 inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Create Project</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {/* 5. Create Project Dialog */}
      <CreateProjectDialog
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
    </div>
  );
}