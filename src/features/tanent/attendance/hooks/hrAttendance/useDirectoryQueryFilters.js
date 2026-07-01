import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { debounce } from "../../utils/hrAttendance";

export function useDirectoryQueryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    return {
      date: searchParams.get("date") || todayStr,
      department: searchParams.get("department") || "",
      shift_name: searchParams.get("shift_name") || "",
      attendance_status: searchParams.get("attendance_status") || "",
      current_state: searchParams.get("current_state") || "",
      needs_review: searchParams.get("needs_review") || "",
      auto_closed: searchParams.get("auto_closed") || "",
      late_only: searchParams.get("late_only") || "",
      missing_checkout: searchParams.get("missing_checkout") || "",
      search: searchParams.get("search") || "",
      limit: parseInt(searchParams.get("limit") || "50", 10),
      offset: parseInt(searchParams.get("offset") || "0", 10),
      ordering: searchParams.get("ordering") || "employee_name",
      employment_status: searchParams.get("employment_status") || "ACTIVE",
    };
  }, [searchParams]);

  const updateFilters = useCallback((updatedFields) => {
    setSearchParams((prev) => {
      const nextParams = new URLSearchParams(prev);
      Object.entries(updatedFields).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") {
          nextParams.delete(key);
        } else {
          nextParams.set(key, String(value));
        }
      });
      // Reset pagination page offsets on structural parameter shifts
      if (!updatedFields.hasOwnProperty("offset")) {
        nextParams.delete("offset");
      }
      return nextParams;
    });
  }, [setSearchParams]);

  const clearFilters = useCallback(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    setSearchParams({ date: todayStr, limit: "50" });
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
    clearFilters,
  };
}