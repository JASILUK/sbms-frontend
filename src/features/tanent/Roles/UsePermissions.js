// features/roles/hooks/usePermissions.js
import { useMemo } from "react";
import { useGetPermissionsQuery } from ".";

export const usePermissions = () => {
  const { data: response, isLoading, error } = useGetPermissionsQuery();

  const permissions = useMemo(() => {
    if (!response?.data) return [];
    return response.data;
  }, [response]);

  const groupedPermissions = useMemo(() => {
    const groups = {};
    
    permissions.forEach((perm) => {
      const category = perm.category || "Other";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(perm);
    });

    return Object.entries(groups)
      .map(([category, perms]) => ({
        category,
        permissions: perms.sort((a, b) => a.name.localeCompare(b.name)),
      }))
      .sort((a, b) => a.category.localeCompare(b.category));
  }, [permissions]);

  return {
    permissions,
    groupedPermissions,
    isLoading,
    error,
  };
};