import { useGetAttendanceDashboardQuery } from '../api/attendanceDashboardApi';

export function useAttendanceDashboard() {
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useGetAttendanceDashboardQuery(undefined, {
    refetchOnMountOrArgChange: true,
    refetchOnFocus: true,
  });

  return {
    dashboard: data?.data || null,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}