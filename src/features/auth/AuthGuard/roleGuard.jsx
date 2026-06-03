import { Navigate } from "react-router-dom";
import { useSession } from "../useSession";

export default function RoleGuard({ role, children }) {
  const { session, isLoading } = useSession()

  if (isLoading) return <div>Loading...</div>;

  const accountType = session?.account_type;

  if (accountType !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}