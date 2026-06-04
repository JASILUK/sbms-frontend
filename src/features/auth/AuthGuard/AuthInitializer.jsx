import { Outlet } from "react-router-dom";
import { useGetMeQuery } from "../authApi";

export default function AuthInitializer() {

  const { isLoading } = useGetMeQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  if (isLoading) {
    return <div>Loading session...</div>;
  }

  return <Outlet />;
}