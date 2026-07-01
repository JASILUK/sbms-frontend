import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useProfileQueryFilters() {
  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(() => {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split("T")[0];
    const todayStr = now.toISOString().split("T")[0];

    return {
      date_from: searchParams.get("date_from") || firstDay,
      date_to: searchParams.get("date_to") || todayStr,
      status: searchParams.get("status") || "",
      late: searchParams.get("late") || "",
      needs_review: searchParams.get("needs_review") || "",
      auto_closed: searchParams.get("auto_closed") || "",
      ordering: searchParams.get("ordering") || "-attendance_date",
      limit: parseInt(searchParams.get("limit") || "20", 10),
      offset: parseInt(searchParams.get("offset") || "0", 10),
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
      if (!updatedFields.hasOwnProperty("offset")) {
        nextParams.delete("offset");
      }
      return nextParams;
    });
  }, [setSearchParams]);

  return {
    filters,
    updateFilters,
  };
}