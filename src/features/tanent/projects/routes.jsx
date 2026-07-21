import React from "react";
import { Route } from "react-router-dom";
import ProjectsLayout from "./layouts/ProjectsLayout";
import ProjectWorkspaceLayout from "./layouts/ProjectWorkspaceLayout";
import ProjectsListPage from "./pages/ProjectsListPage";
import ProjectOverviewPage from "./pages/ProjectOverviewPage";
import PermissionGuard from "../../auth/AuthGuard/permissionGuard";
import ProjectMembersPage from "./pages/ProjectMembersPage";

export const projectRoutes = (
  <Route
    path="projects"
    element={
      <PermissionGuard permission="tenant.project.view">
        <ProjectsLayout />
      </PermissionGuard>
    }
  >
    {/* List Workspace Page */}
    <Route index element={<ProjectsListPage />} />

    {/* Single Project Workspace Route Group */}
    <Route path=":projectId" element={<ProjectWorkspaceLayout />}>
      {/* Default Tab: Overview */}
      <Route index element={<ProjectOverviewPage />} />
      <Route path="members" element={<ProjectMembersPage />} />
    </Route>
  </Route>
);