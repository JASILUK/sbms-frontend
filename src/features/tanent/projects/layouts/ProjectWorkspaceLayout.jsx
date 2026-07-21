import React from "react";
import {
  Outlet,
  NavLink,
  useParams,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  CheckSquare,
  Video,
  FileText,
  Activity,
  ArrowLeft,
  ChevronRight,
  ChevronDown,
  Building2,
} from "lucide-react";
import { useProjectOverview } from "../hooks/useProjectOverview";
import { StatusBadge } from "../components/shared/StatusBadge";
import { VisibilityBadge } from "../components/shared/VisibilityBadge";

export default function ProjectWorkspaceLayout() {
  const { projectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const { project, isLoading, isError } = useProjectOverview(projectId);

  // Workspace Navigation Tabs
  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: LayoutDashboard,
      path: `/app/projects/${projectId}`,
      enabled: true,
    },
    {
      id: "tasks",
      label: "Tasks",
      icon: CheckSquare,
      path: `/app/projects/${projectId}/tasks`,
      enabled: false,
    },
    {
      id: "members",
      label: "Members",
      icon: Users,
      path: `/app/projects/${projectId}/members`,
      enabled: true,
    },
    {
      id: "meetings",
      label: "Meetings",
      icon: Video,
      path: `/app/projects/${projectId}/meetings`,
      enabled: false,
    },
    {
      id: "files",
      label: "Files",
      icon: FileText,
      path: `/app/projects/${projectId}/files`,
      enabled: false,
    },
    {
      id: "activity",
      label: "Activity",
      icon: Activity,
      path: `/app/projects/${projectId}/activity`,
      enabled: false,
    },
  ];

  // ---------------------------------------------------------------------------
  // Loading Skeleton
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="space-y-5 animate-pulse">
        <div className="h-5 w-40 bg-slate-200/80 rounded-md" />
        <div className="h-32 bg-white rounded-2xl border border-slate-200/80 shadow-sm" />
        <div className="h-11 bg-white rounded-xl border border-slate-200/80" />
        <div className="h-96 bg-white rounded-2xl border border-slate-200/80 shadow-sm" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Error State
  // ---------------------------------------------------------------------------
  if (isError || !project) {
    return (
      <div className="py-12 flex items-center justify-center">
        <div className="p-8 text-center bg-white rounded-2xl border border-slate-200/80 max-w-md w-full shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-100">
            <Activity className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Project Not Found</h3>
          <p className="text-xs text-slate-500 mt-1.5 mb-6 leading-relaxed">
            The workspace project you are trying to view does not exist or has been restricted.
          </p>
          <Link
            to="/tenant/projects"
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-semibold shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to All Projects
          </Link>
        </div>
      </div>
    );
  }

  const currentTab = tabs.find((t) => t.path === location.pathname) || tabs[0];

  return (
    <div className="space-y-5">
      {/* 1. Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs font-medium text-slate-500">
        <Link
          to="/app/projects"
          className="hover:text-indigo-600 flex items-center gap-1.5 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Projects
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
        <span className="font-mono font-bold text-slate-800 uppercase tracking-wide">
          {project.code}
        </span>
      </nav>

      {/* 2. Workspace Hero Banner */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 shadow-sm relative overflow-hidden">
        {/* Top Branding Line */}
        <div
          className="absolute top-0 left-0 right-0 h-1"
          style={{ backgroundColor: project.color || "#6366F1" }}
        />

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className="w-11 h-11 rounded-xl shrink-0 shadow-sm flex items-center justify-center text-white font-bold text-base"
              style={{ backgroundColor: project.color || "#6366F1" }}
            >
              {project.code ? project.code.substring(0, 2).toUpperCase() : "PR"}
            </div>

            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {project.name}
                </h1>
                <span className="text-[11px] font-mono font-bold uppercase text-slate-500 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                  {project.code}
                </span>
              </div>

              {project.client_company && (
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  <span>
                    Client: <strong className="text-slate-700 font-semibold">{project.client_company}</strong>
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <VisibilityBadge visibility={project.visibility} />
            <StatusBadge status={project.status} />
          </div>
        </div>
      </div>

      {/* 3. Tab Bar Navigation */}
      <div className="bg-white border border-slate-200/80 rounded-xl px-3 shadow-sm">
        {/* Mobile Dropdown (< md) */}
        <div className="md:hidden py-2.5">
          <div className="relative">
            <select
              value={currentTab.path}
              onChange={(e) => navigate(e.target.value)}
              className="w-full appearance-none pl-3.5 pr-10 py-2 rounded-lg border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {tabs.map((tab) => (
                <option key={tab.id} value={tab.path} disabled={!tab.enabled}>
                  {tab.label} {!tab.enabled ? " (Coming Soon)" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* Desktop Tabs (>= md) */}
        <nav className="hidden md:flex items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                end={tab.id === "overview"}
                onClick={(e) => !tab.enabled && e.preventDefault()}
                className={({ isActive }) =>
                  `inline-flex items-center gap-2 px-4 py-3.5 border-b-2 text-xs font-semibold transition-all whitespace-nowrap ${
                    !tab.enabled
                      ? "border-transparent text-slate-300 cursor-not-allowed"
                      : isActive
                      ? "border-indigo-600 text-indigo-600 font-bold"
                      : "border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300"
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
                {!tab.enabled && (
                  <span className="text-[9px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-slate-100 text-slate-400 border border-slate-200/60">
                    Soon
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* 4. Tab Body Content */}
      <main className="pt-1">
        <Outlet context={{ project }} />
      </main>
    </div>
  );
}