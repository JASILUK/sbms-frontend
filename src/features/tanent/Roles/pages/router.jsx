import { Route } from "react-router-dom";
import PermissionGuard from "../../../auth/AuthGuard/permissionGuard";

import RoleListPage from "./RolesListPage";
import RoleCreatePage from "./RolesCreatePage";

export const roleRoutes = (
  <>
    <Route
      path="roles"
      element={
        <PermissionGuard permission="tenant.role.view">
          <RoleListPage />
        </PermissionGuard>
      }
    />

    <Route
      path="roles/create"
      element={
        <PermissionGuard permission="tenant.role.create">
          <RoleCreatePage />
        </PermissionGuard>
      }
    />
  </>
)