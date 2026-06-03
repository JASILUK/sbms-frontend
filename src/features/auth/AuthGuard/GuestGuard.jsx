import { Navigate, Outlet } from "react-router-dom";
import { useSession } from "../useSession";

export default function GuestGuard() {

  const { session, isLoading } = useSession();

  if (isLoading) return <div>Loading...</div>;

  if (session) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}