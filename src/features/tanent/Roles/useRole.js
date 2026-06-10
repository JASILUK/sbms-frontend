// features/roles/hooks/useRoles.js
import { useMemo, useState } from "react";
import { useGetRolesQuery } from "./rolesApi";

export const useRoles = () => {
  const { data: response, isLoading, error, refetch } = useGetRolesQuery();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const roles = useMemo(() => {
    if (!response?.data) return [];
    return response.data;
  }, [response]);

  const filteredRoles = useMemo(() => {
    let result = roles;

    // Apply type filter
    if (filter === "system") {
      result = result.filter((r) => r.is_system_role);
    } else if (filter === "custom") {
      result = result.filter((r) => !r.is_system_role);
    }

    // Apply search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((r) => r.name.toLowerCase().includes(query));
    }

    return result;
  }, [roles, filter, searchQuery]);

  return {
    roles: filteredRoles,
    allRoles: roles,
    isLoading,
    error,
    refetch,
    searchQuery,
    setSearchQuery,
    filter,
    setFilter,
  };
};