import { useTenantContext } from "../tanent/tanatContextHook";
// import { usePlatformContext } from "../platform/platforContextHook";
import { useSession } from "./useSession";

export const usePermission = () => {

  const { session } = useSession();

  const tenant = useTenantContext();
  // const platform = usePlatformContext();

  // const permissions =
  //   session?.account_type === "platform"
  //     ? platform.permissions
  //     : tenant.permissions;


    const permissions = tenant.permissions
  const hasPermission = (code) => permissions.includes(code);

  return { hasPermission };
};