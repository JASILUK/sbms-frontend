
import { Outlet } from "react-router-dom";
// import { useGetPlatformContextQuery } from "../features/platform/platformApi";

export default function PlatformLayout() {
//  const { data, isLoading } = useGetPlatformContextQuery();

  // if (isLoading) {
  //   return <div>Loading platform...</div>;
  // }

  return (
    <div className="platform-layout">
      {/* Sidebar */}
      {/* Header */}

      <main>
        <Outlet />
      </main>
    </div>
  );
}