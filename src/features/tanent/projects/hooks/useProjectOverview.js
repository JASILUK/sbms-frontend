import { useGetProjectDetailQuery } from "../api/projectApi";

export const useProjectOverview = (projectId) => {
  const { data, isLoading, isError, error, refetch } = useGetProjectDetailQuery(projectId, {
    skip: !projectId,
  });

  return {
    project: data?.data || null,
    isLoading,
    isError,
    error,
    refetch,
  };
};