import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useReviewFilters(defaultLimit = 10) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInputValue, setSearchInputValue] = useState(searchParams.get("search") || "");

  const filters = useMemo(() => {
    return {
      search: searchParams.get("search") || "",
      department: searchParams.get("department") || "",
      date: searchParams.get("date") || "",
      date_from: searchParams.get("date_from") || "",
      date_to: searchParams.get("date_to") || "",
      review_reason: searchParams.get("review_reason") || "",
      status: searchParams.get("status") || "",
      limit: parseInt(searchParams.get("limit") || String(defaultLimit), 10),
      offset: parseInt(searchParams.get("offset") || "0", 10),
      ordering: searchParams.get("ordering") || "-attendance_date",
    };
  }, [searchParams, defaultLimit]);

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

  const clearFilters = useCallback(() => {
    setSearchInputValue("");
    setSearchParams({});
  }, [setSearchParams]);

  return {
    filters,
    searchInputValue,
    setSearchInputValue,
    updateFilters,
    clearFilters,
  };
}