import { Route } from "react-router-dom";

import DepartmentListPage from "./pages/DepartmentListPage";
import DepartmentDetailPage from "./pages/DepartmentDetailPage";

import { PERMISSIONS } from "../../../shared/constants/permissions";

import PermissionGuard from "../../auth/AuthGuard/permissionGuard";

export const departmentRoutes = (
  <>
    <Route
      path="departments"
      element={
        <PermissionGuard
          permission={PERMISSIONS.DEPARTMENT.VIEW}
        >
          <DepartmentListPage />
        </PermissionGuard>
      }
    />

    <Route
      path="departments/:id"
      element={
        <PermissionGuard
          permission={PERMISSIONS.DEPARTMENT.VIEW}
        >
          <DepartmentDetailPage />
        </PermissionGuard>
      }
    />
  </>
);