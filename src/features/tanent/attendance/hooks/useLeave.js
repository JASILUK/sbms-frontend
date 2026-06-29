import { useState, useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  useGetMyLeaveBalancesQuery,
  useGetMyLeaveRequestsQuery,
  useGetHRLeaveRequestsQuery,
  useGetLeaveTypesQuery,
  useGetEmployeeLeaveBalancesQuery,
  useGetEmployeeLeaveRequestsQuery,
  useAdjustLeaveBalanceMutation,
} from "../api/leaveApi";
import { useGetEmployeesQuery } from "../../emplyees/emplyeeApi";

export function useLeave() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState("my-leaves");
  const [adminSubTab, setAdminSubTab] = useState("requests");
  
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const [selectedLeaveId, setSelectedLeaveId] = useState(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  
  const [isTypeFormOpen, setIsTypeFormOpen] = useState(false);
  const [editingType, setEditingType] = useState(null);

  // Adjustment Target Modal States
  const [isAdjustmentModalOpen, setIsAdjustmentModalOpen] = useState(false);
  const [selectedBalanceRow, setSelectedBalanceRow] = useState(null);

  const [adjustLeaveBalance, { isLoading: isAdjustingLog }] = useAdjustLeaveBalanceMutation();

  // Calendar Month Navigation States
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentYearState, setCurrentYearState] = useState(new Date().getFullYear());

  const [calendarSelection, setCalendarSelection] = useState({ start: null, end: null });

  // Sync calendar values with administrative queries and trackers
  const year = useMemo(() => parseInt(searchParams.get("year") || currentYearState.toString(), 10), [searchParams, currentYearState]);
  const statusFilter = useMemo(() => searchParams.get("status") || "", [searchParams]);
  const leaveTypeFilter = useMemo(() => searchParams.get("leave_type") || "", [searchParams]);
  const dateFrom = useMemo(() => searchParams.get("date_from") || "", [searchParams]);
  const dateTo = useMemo(() => searchParams.get("date_to") || "", [searchParams]);
  const limit = useMemo(() => parseInt(searchParams.get("limit") || "50", 10), [searchParams]);
  const offset = useMemo(() => parseInt(searchParams.get("offset") || "0", 10), [searchParams]);

  const employeeRequestParams = useMemo(() => ({
    year, limit, offset,
    ...(statusFilter && { status: statusFilter }),
    ...(leaveTypeFilter && { leave_type: leaveTypeFilter }),
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo }),
  }), [year, statusFilter, leaveTypeFilter, dateFrom, dateTo, limit, offset]);

  const hrRequestParams = useMemo(() => ({
    year, limit, offset,
    ...(statusFilter && { status: statusFilter }),
    ...(leaveTypeFilter && { leave_type: leaveTypeFilter }),
    ...(dateFrom && { date_from: dateFrom }),
    ...(dateTo && { date_to: dateTo }),
  }), [year, statusFilter, leaveTypeFilter, dateFrom, dateTo, limit, offset]);

  const { data: myBalances, isLoading: isBalancesLoading, refetch: refetchBalances } = useGetMyLeaveBalancesQuery({ year });
  const { data: myRequests, isLoading: isMyRequestsLoading, refetch: refetchMyRequests } = useGetMyLeaveRequestsQuery(employeeRequestParams);
  const { data: hrRequests, isLoading: isHrRequestsLoading, refetch: refetchHrRequests } = useGetHRLeaveRequestsQuery(hrRequestParams, { skip: activeTab !== "team-leaves" || adminSubTab !== "requests" });
  const { data: leaveTypes, isLoading: isTypesLoading, refetch: refetchTypes } = useGetLeaveTypesQuery({ active_only: "false" });
  const { data: directoryEmployees, isLoading: isDirLoading } = useGetEmployeesQuery(undefined, { skip: activeTab !== "team-leaves" || adminSubTab !== "employees" });

  const { data: drillBalances, refetch: refetchDrillBalances } = useGetEmployeeLeaveBalancesQuery({ membershipId: selectedEmployeeId, year }, { skip: !selectedEmployeeId });
  const { data: drillRequests } = useGetEmployeeLeaveRequestsQuery({ membershipId: selectedEmployeeId, params: { year } }, { skip: !selectedEmployeeId });

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
    setIsFiltersOpen(false);
    setSelectedEmployeeId(null);
  }, []);

  const handleMonthChange = useCallback((newMonth, newYear) => {
    setCurrentMonth(newMonth);
    setCurrentYearState(newYear);
    setSearchParams((prev) => {
      prev.set("year", newYear.toString());
      return prev;
    });
  }, [setSearchParams]);

  const handleApplyFilters = useCallback((filters) => {
    setSearchParams((prev) => {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) prev.set(key, value.toString());
        else prev.delete(key);
      });
      prev.set("offset", "0");
      return prev;
    });
  }, [setSearchParams]);

  const handleResetFilters = useCallback(() => {
    setSearchParams((prev) => {
      prev.entries().forEach(([key]) => prev.delete(key));
      prev.set("year", new Date().getFullYear().toString());
      prev.set("offset", "0");
      return prev;
    });
    setCurrentYearState(new Date().getFullYear());
    setCurrentMonth(new Date().getMonth() + 1);
  }, [setSearchParams]);

  const handleRefreshAll = useCallback(() => {
    refetchBalances();
    refetchMyRequests();
    refetchHrRequests();
    refetchTypes();
    if (selectedEmployeeId) refetchDrillBalances();
  }, [refetchBalances, refetchMyRequests, refetchHrRequests, refetchTypes, selectedEmployeeId, refetchDrillBalances]);

  const unpackResults = (payload) => {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload;
    if (Array.isArray(payload.data)) return payload.data;
    if (payload.results && Array.isArray(payload.results)) return payload.results;
    if (payload.data?.results && Array.isArray(payload.data.results)) return payload.data.results;
    return [];
  };

  return {
    activeTab, adminSubTab, isFiltersOpen, selectedLeaveId, isFormOpen, isDetailOpen,
    isTypeFormOpen, editingType, selectedEmployeeId, calendarSelection, year, currentMonth, statusFilter,
    leaveTypeFilter, myBalances: myBalances?.data || [], myRequests: unpackResults(myRequests),
    hrRequests: unpackResults(hrRequests), hrStatistics: hrRequests?.data?.statistics || hrRequests?.statistics || null,
    leaveTypes: leaveTypes?.data || [], employeesList: unpackResults(directoryEmployees),
    drillBalances: drillBalances?.data || [], drillRequests: unpackResults(drillRequests),
    isLoading: isBalancesLoading || isMyRequestsLoading || isHrRequestsLoading || isTypesLoading || isDirLoading,
    isAdjustmentModalOpen, selectedBalanceRow, isAdjustingLog, adjustLeaveBalance,
    setIsAdjustmentModalOpen, setSelectedBalanceRow, setAdminSubTab, setIsFiltersOpen, 
    setSelectedLeaveId, setIsFormOpen, setIsDetailOpen, setIsTypeFormOpen, setEditingType, 
    setSelectedEmployeeId, setCalendarSelection, handleTabChange, handleMonthChange, handleApplyFilters, 
    handleResetFilters, handleRefreshAll, unpackResults
  };
}