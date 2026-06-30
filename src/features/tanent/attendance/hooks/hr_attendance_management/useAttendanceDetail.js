import { useGetHRRecordDetailQuery } from "../../api/hrAttendanceManagementApi";

/**
 * Drives the Detail Drawer / Detail Page.
 * `recordId` is nullable -- pass null when the drawer is closed to skip the fetch.
 */
export function useAttendanceDetail(recordId) {
  const { data, isLoading, isFetching, isError, error, refetch } = useGetHRRecordDetailQuery(recordId, {
    skip: !recordId,
  });

  return {
    dailyRecord: data?.data?.daily_record ?? null,
    timeline: data?.data?.timeline ?? [],
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  };
}
