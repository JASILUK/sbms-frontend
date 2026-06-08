import { Navigate } from "react-router-dom";
import { useSession } from "../auth/useSession";

export default function TenantGuard({ children }) {

  const { session, isLoading } = useSession();

  if (isLoading) return <div>Loading...</div>;

  const companies = session?.companies || [];
  const activeCompanyId = localStorage.getItem("activeCompanyId");

  if (companies.length === 0) {
    return <Navigate to="/workspaces" replace />;
  }

  if (!activeCompanyId) {
    return <Navigate to="/workspaces" replace />;
  }

  return children;
}