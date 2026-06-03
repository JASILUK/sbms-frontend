import { Navigate } from "react-router-dom";
import { usePermission } from "../usePermission";

export default function PermissionGuard({ permission, children }) {
  const { hasPermission } = usePermission();

  if (!hasPermission(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

