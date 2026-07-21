import { useState } from "react";
import { useGetProjectsQuery } from "../api/projectApi";

export const useProjects = () => {
  const [filters, setFilters] = useState({
    search: "",
    status: "",
    visibility: "",
    ordering: "-created_at",
    limit: 20,
    offset: 0,
  });

  const { data, isLoading, isFetching, isError, error, refetch } = useGetProjectsQuery(filters);

  const updateFilter = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(key !== "offset" ? { offset: 0 } : {}),
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "",
      visibility: "",
      ordering: "-created_at",
      limit: 20,
      offset: 0,
    });
  };

  const responseData = data?.data || {};

  return {
    projects: responseData.results || [],
    pagination: responseData.pagination || {},
    summary: responseData.summary || {},
    filtersConfig: responseData.filters || {},
    currentFilters: filters,
    isLoading,
    isFetching,
    isError,
    error,
    updateFilter,
    resetFilters,
    refetch,
  };
};