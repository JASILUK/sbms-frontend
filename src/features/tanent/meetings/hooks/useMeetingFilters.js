import { useState, useCallback, useMemo } from "react";
import { isMeetingLive, isMeetingToday } from "../utils/meetingUtils";

/**
 * Hook for meeting filtering.
 * NOTE: Ordering is handled by the BACKEND via query params.
 * This hook only handles client-side search and status filtering.
 */
export const useMeetingFilters = (meetings = []) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Live meetings (derived from current data)
  const liveMeetings = useMemo(
    () => meetings.filter(isMeetingLive),
    [meetings]
  );

  // Today's scheduled meetings (non-live)
  const todayMeetings = useMemo(
    () =>
      meetings.filter(
        (m) => isMeetingToday(m) && !isMeetingLive(m)
      ),
    [meetings]
  );

  // Filtered meetings for the table/list
  // Backend already handles ordering via query params
  const filteredMeetings = useMemo(() => {
    let result = [...meetings];

    // Search filter (client-side fallback for title/organizer)
    if (searchQuery.trim()) {
      const term = searchQuery.toLowerCase();
      result = result.filter(
        (m) =>
          m.title?.toLowerCase().includes(term) ||
          m.created_by?.toLowerCase().includes(term)
      );
    }

    // Status filter (client-side, or can be moved to backend params)
    if (statusFilter) {
      result = result.filter((m) => m.status === statusFilter);
    }

    // NO client-side sorting here — backend handles ordering
    return result;
  }, [meetings, searchQuery, statusFilter]);

  const resetFilters = useCallback(() => {
    setSearchQuery("");
    setStatusFilter("");
  }, []);

  const hasActiveFilters = Boolean(searchQuery || statusFilter);

  return {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    liveMeetings,
    todayMeetings,
    filteredMeetings,
    resetFilters,
    hasActiveFilters,
  };
};
