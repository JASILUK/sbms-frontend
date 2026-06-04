// CSRFInitializer.jsx

import { Outlet } from "react-router-dom";
import { useGetCSRFQuery } from "../authApi";

export default function CSRFInitializer() {

  const { isLoading, isError } = useGetCSRFQuery(undefined, {
    refetchOnMountOrArgChange: false, // 🔥 only once
  });

  // 🔥 Prevent app from rendering before CSRF is ready
  if (isLoading) {
    return <div>Initializing security...</div>;
  }

  // optional: handle error
  if (isError) {
    return <div>Failed to initialize security</div>;
  }

  return <Outlet />;
}