import React from "react";
import { useOutletContext } from "react-router-dom";
import { ProjectHero } from "../components/overview/ProjectHero";
import { ProjectOverviewGrid } from "../components/overview/ProjectOverviewGrid";

export default function ProjectOverviewPage() {
  // Access project context passed down from ProjectWorkspaceLayout
  const { project } = useOutletContext();

  if (!project) return null;

  return (
    <div className="space-y-6">
      {/* Detailed Project Metadata (Owner, Timeline, Description, Client) */}
      <ProjectHero project={project} />

      {/* Workspace Metric Cards (Members, Tasks, Meetings, Files, Activity) */}
      <ProjectOverviewGrid project={project} />
    </div>
  );
}