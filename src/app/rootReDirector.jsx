import { Navigate } from "react-router-dom";
import { useSession } from "../features/auth/useSession";
import { useActiveCompany } from "../hooks/usActiveCompany";

// RootRedirect becomes cleaner:
export function RootRedirect() {
  const { session, isLoading } = useSession();
  
  if (isLoading) return <div>Loading...</div>;
  
  if (session?.account_type === "platform") {
    return <Navigate to="/platform/dashboard" replace />;
  }

  if (session?.account_type === "tenant") {
    const companies = session?.companies || [];
    const { getActiveCompany, setActiveCompany, validCompanyIds } = useActiveCompany(companies);
    
    const activeCompany = getActiveCompany();

    if (companies.length === 0) {
      return <Navigate to="/app/workspaces" replace />;
    }

    if (companies.length === 1) {
      setActiveCompany(companies[0].id);
      return <Navigate to="/app/dashboard" replace />;
    }

    // Multiple companies
    if (activeCompany) {
      return <Navigate to="/app/dashboard" replace />;
    }
    
    return <Navigate to="/app/workspaces" replace />;
  }

  return <Navigate to="/login" replace />;
}