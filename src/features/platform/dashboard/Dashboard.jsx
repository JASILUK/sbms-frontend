import { useGetMeQuery } from "../../auth/authApi";

export default function PlatformDashboard() {
  const { data } = useGetMeQuery();

  const user = data?.data?.user;
  const role = data?.data?.platform?.role?.name;

  return (
    <div className="p-6 space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold">Platform Dashboard</h1>
        <p className="text-gray-500">
          Welcome back{user?.email ? `, ${user.email}` : ""}.
        </p>
      </div>

      {/* Role Info */}
      <div className="bg-white shadow rounded-lg p-4">
        <h2 className="text-lg font-medium">Your Role</h2>
        <p className="text-gray-600 mt-1">{role || "N/A"}</p>
      </div>

      {/* Example Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Total Tenants</p>
          <p className="text-xl font-semibold mt-1">--</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Active Subscriptions</p>
          <p className="text-xl font-semibold mt-1">--</p>
        </div>

        <div className="bg-white shadow rounded-lg p-4">
          <p className="text-sm text-gray-500">Pending Approvals</p>
          <p className="text-xl font-semibold mt-1">--</p>
        </div>
      </div>

    </div>
  );
}