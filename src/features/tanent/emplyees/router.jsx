import { Route } from "react-router-dom";
import PermissionGuard from "../../auth/AuthGuard/permissionGuard";

import EmployeeListPage from "./pages/emplyeeListPage";
import EmployeeDetailPage from "./pages/employeeDetailedPage";

export const employeeRoutes = (
  <>
    <Route
      path="employees"
      element={
        <PermissionGuard permission="tenant.employee.view">
          <EmployeeListPage />
        </PermissionGuard>
      }
    />

    <Route
      path="employees/:id"
      element={
        <PermissionGuard permission="tenant.employee.view">
          <EmployeeDetailPage />
        </PermissionGuard>
      }
    />
  </>
);