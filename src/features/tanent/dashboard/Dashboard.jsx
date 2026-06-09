import { useSession } from "../../auth/useSession";
import { useTenantContext } from "../tanatContextHook";

export default function TenantDashboard() {

  const { session } = useSession();
  const { company, role, subscription } = useTenantContext();
  const user = session?.user;

  return (
    <div className="p-6 space-y-6">

      <div>
        <h1 className="text-2xl font-semibold">Company Dashboard</h1>
        <p className="text-gray-500">
          Welcome back{user?.email ? `, ${user.email}` : ""}.
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-4 space-y-2">
        <h2 className="text-lg font-medium">Company Info</h2>

        <p>
          <strong>Company:</strong> {company?.name || "N/A"}
        </p>

        <p>
          <strong>Role:</strong> {role?.name || "N/A"}
        </p>

        <p>
          <strong>Plan:</strong> {subscription?.plan || "N/A"}
        </p>

      </div>

    </div>
  );
}