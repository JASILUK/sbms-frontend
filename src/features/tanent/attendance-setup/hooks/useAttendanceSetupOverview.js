// attendance-setup/hooks/useAttendanceSetupOverview.js
import { useMemo } from "react";
import { 
  useGetCompanyScheduleQuery, 
  useGetAttendancePolicyQuery, 
  useGetHolidaysQuery, 
  useGetShiftsQuery, 
  useGetAssignmentsQuery 
} from "../api/attendanceSetupApi";

export function useAttendanceSetupOverview() {
  // Concurrent RTK Query Streams Connections
  const scheduleRes = useGetCompanyScheduleQuery();
  const policyRes = useGetAttendancePolicyQuery();
  const holidaysRes = useGetHolidaysQuery();
  const shiftsRes = useGetShiftsQuery();
  const assignmentsRes = useGetAssignmentsQuery();

  const isLoading = scheduleRes.isLoading || policyRes.isLoading || holidaysRes.isLoading || shiftsRes.isLoading || assignmentsRes.isLoading;
  const error = scheduleRes.error || policyRes.error || holidaysRes.error || shiftsRes.error || assignmentsRes.error;

  // Unpack Streams Safely
  const scheduleData = scheduleRes.data?.data || scheduleRes.data;
  const policyData = policyRes.data?.data || policyRes.data;
  const holidaysList = useMemo(() => holidaysRes.data?.data?.results || holidaysRes.data?.data || [], [holidaysRes.data]);
  const shiftsList = useMemo(() => shiftsRes.data?.data?.results || shiftsRes.data?.data || [], [shiftsRes.data]);
  const assignmentsList = useMemo(() => assignmentsRes.data?.data?.results || assignmentsRes.data?.data || [], [assignmentsRes.data]);

  // Derived Readiness Checks
  const modulesState = useMemo(() => {
    const hasSchedule = !!(scheduleData && Object.keys(scheduleData).length > 0 && scheduleData.work_days?.length > 0);
    const hasPolicy = !!(policyData && Object.keys(policyData).length > 0 && policyData.required_hours);
    const hasHolidays = holidaysList.length > 0;
    const hasShifts = shiftsList.length > 0;
    const hasAssignments = assignmentsList.length > 0;

    let configuredCount = 0;
    if (hasSchedule) configuredCount++;
    if (hasPolicy) configuredCount++;
    if (hasHolidays) configuredCount++;
    if (hasShifts) configuredCount++;
    if (hasAssignments) configuredCount++;

    const score = configuredCount * 20; // 5 modules * 20% weight = 100% total

    return {
      schedule: { isConfigured: hasSchedule, raw: scheduleData },
      policy: { isConfigured: hasPolicy, raw: policyData },
      holidays: { isConfigured: hasHolidays, raw: holidaysList },
      shifts: { isConfigured: hasShifts, raw: shiftsList },
      assignments: { isConfigured: hasAssignments, raw: assignmentsList },
      score,
      configuredCount,
      isSetupComplete: configuredCount === 5
    };
  }, [scheduleData, policyData, holidaysList, shiftsList, assignmentsList]);

  // Checklist Generation Model
  const checklist = useMemo(() => [
    {
      id: "schedule",
      title: "Configure Working Schedule",
      description: "Define structural organizational working days, core shift boundaries, and base system timezones.",
      isCompleted: modulesState.schedule.isConfigured,
      path: "/app/setup-attendance/working-schedules"
    },
    {
      id: "policy",
      title: "Configure Attendance Rules",
      description: "Establish tracking grace boundaries, late deduction thresholds, half-day hour limits, and overtime metrics.",
      isCompleted: modulesState.policy.isConfigured,
      path: "/app/setup-attendance/policies"
    },
    {
      id: "holidays",
      title: "Add Holidays Calendar",
      description: "Populate public observation holiday registers or link customizable localized institutional closures.",
      isCompleted: modulesState.holidays.isConfigured,
      path: "/app/setup-attendance/holidays"
    },
    {
      id: "shifts",
      title: "Create Shift Templates",
      description: "Draft structural reusable operational shift windows containing definitive start, break, and night-shift identifiers.",
      isCompleted: modulesState.shifts.isConfigured,
      path: "/app/setup-attendance/shift-templates"
    },
    {
      id: "assignments",
      title: "Assign Employees",
      description: "Provision concrete workforce connections linking structural corporate profiles directly into targeted active schedules.",
      isCompleted: modulesState.assignments.isConfigured,
      path: "/app/setup-attendance/shift-assignments"
    }
  ], [modulesState]);

  // Guardrail Warning Manifest Processing Engine
  const notices = useMemo(() => {
    const list = [];
    if (!modulesState.schedule.isConfigured) {
      list.push({ id: "schedule", level: "critical", text: "Attendance logging systems are currently locked. Tracking processes cannot initialize until a structural working schedule is defined." });
    }
    if (!modulesState.policy.isConfigured) {
      list.push({ id: "policy", level: "warning", text: "Absence of defined operational guidelines detected. Attendance computation engines will map parameters back onto baseline system fallback defaults." });
    }
    if (!modulesState.holidays.isConfigured) {
      list.push({ id: "holidays", level: "info", text: "Public calendar records look blank. System records will classify upcoming standard governmental holydays as standard unassigned work cycles." });
    }
    if (!modulesState.shifts.isConfigured) {
      list.push({ id: "shifts", level: "warning", text: "Reusable pattern blocks are absent. The runtime tracking framework will use core hardcoded structural time parameters." });
    }
    if (!modulesState.assignments.isConfigured) {
      list.push({ id: "assignments", level: "critical", text: "Active team allocation routes are blank. Employees will fail to receive tracking metrics until targeted assignments are mapped." });
    }
    return list;
  }, [modulesState]);

  return {
    isLoading,
    error,
    refetch: () => {
      scheduleRes.refetch();
      policyRes.refetch();
      holidaysRes.refetch();
      shiftsRes.refetch();
      assignmentsRes.refetch();
    },
    modulesState,
    checklist,
    notices
  };
}