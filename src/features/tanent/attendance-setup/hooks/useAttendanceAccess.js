import { useMemo, useCallback, useEffect } from 'react';
import { orderRulesByPriorityMetrics } from '../utils/accessHelpers';

// Core Subsystem Access API hooks
import {
  useGetCompanyDefaultsProfileQuery,
  useGetAccessRulesProfilesQuery,
  useGetEmployeeOverridesProfilesQuery
} from '../api/attendanceAccessApi';

// Standardized Deployed Production Core API Hooks Shared Ingestion Bridges
import { useGetEmployeesQuery } from '../../emplyees/emplyeeApi';
import { useGetDepartmentsQuery } from '../../deaprtment/departmentApi';
import { useGetAttendanceMethodsQuery } from '../api/attendanceMethodsApi';
import { useGetAttendanceLocationsQuery } from '../api/attendanceLocationsApi';

export function useAttendanceAccess() {
  const defaultsQuery = useGetCompanyDefaultsProfileQuery();
  const rulesQuery = useGetAccessRulesProfilesQuery();
  const overridesQuery = useGetEmployeeOverridesProfilesQuery();
  
  // Re-routed to direct live system data layers
  const staffQuery = useGetEmployeesQuery();
  const structuralNodeQuery = useGetDepartmentsQuery();
  const methodsQuery = useGetAttendanceMethodsQuery();
  const spatialPerimeterQuery = useGetAttendanceLocationsQuery({ activeOnly: true });

  const isAccessDataLoading =
    defaultsQuery.isLoading || 
    rulesQuery.isLoading || 
    overridesQuery.isLoading ||
    staffQuery.isLoading || 
    structuralNodeQuery.isLoading || 
    methodsQuery.isLoading || 
    spatialPerimeterQuery.isLoading;

  const isAccessDataFetching =
    defaultsQuery.isFetching || 
    rulesQuery.isFetching || 
    overridesQuery.isFetching;

  // Standardized parsing matrix using target schema payloads
  const companyMethodsPool = useMemo(() => {
    return methodsQuery.data?.data ?? [];
  }, [methodsQuery.data]);

  const companyLocationsPool = useMemo(() => {
    return (spatialPerimeterQuery.data?.data ?? [])
      .filter(location => location.is_active);
  }, [spatialPerimeterQuery.data]);

  const employeesPool = useMemo(() => {
    return staffQuery.data?.data ?? [];
  }, [staffQuery.data]);

  const departmentsPool = useMemo(() => {
    return structuralNodeQuery.data?.data ?? [];
  }, [structuralNodeQuery.data]);

  const orderedAccessRules = useMemo(() => {
    const rawRules = rulesQuery.data?.data ?? [];
    return orderRulesByPriorityMetrics(rawRules);
  }, [rulesQuery.data]);

  const parsedEmployeeOverrides = useMemo(() => {
    return overridesQuery.data?.data ?? [];
  }, [overridesQuery.data]);

  // Dictionary Lookup Maps declarations safely positioned below their target array dependencies
  const employeeIndexMap = useMemo(() => new Map(employeesPool.map(e => [e.id, e])), [employeesPool]);
  const departmentIndexMap = useMemo(() => new Map(departmentsPool.map(d => [d.id, d])), [departmentsPool]);
  const spatialIndexMap = useMemo(() => new Map(companyLocationsPool.map(l => [l.id, l])), [companyLocationsPool]);

  // ✅ FIXED CRASH: Console diagnostics block moved below initialization block declarations
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log("=== ATTENDANCE ACCESS METRICS VERIFICATION TRACE ===");
      console.log("1. Methods Pool Records Array length:", companyMethodsPool.length, companyMethodsPool);
      console.log("2. Locations Pool Records Array length:", companyLocationsPool.length, companyLocationsPool);
      console.log("====================================================");
    }
  }, [companyMethodsPool, companyLocationsPool]);

  const refetchFeatureModuleCache = useCallback(() => {
    defaultsQuery.refetch();
    rulesQuery.refetch();
    overridesQuery.refetch();
  }, [defaultsQuery, rulesQuery, overridesQuery]);



  console.log("========== ACCESS HOOK ==========");
  console.log("Methods Pool:", companyMethodsPool);
  console.log("Locations Pool:", companyLocationsPool);
  console.log("Employees Pool:", employeesPool);
  console.log("Departments Pool:", departmentsPool);
  console.log("=================================");
  return {
    companyDefaults: defaultsQuery.data?.data || defaultsQuery.data || null,
    accessRules: orderedAccessRules,
    employeeOverrides: parsedEmployeeOverrides,
    employeesPool,
    departmentsPool,
    companyMethodsPool,
    companyLocationsPool,
    employeeIndexMap,
    departmentIndexMap,
    spatialIndexMap,
    isAccessDataLoading,
    isAccessDataFetching,
    refetch: refetchFeatureModuleCache
  };
}