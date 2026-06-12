import { useMemo } from "react";
import {
  useGetEmployeesQuery,
  useGetEmployeeDetailQuery,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
  useBlockEmployeeMutation,
  useUnblockEmployeeMutation,
  useInviteEmployeeMutation,
} from "../emplyees/emplyeeApi";

export const useEmployees = (employeeId) => {

  const {
    data: employeesResponse,
    isLoading: isLoadingList,
    error: listError,
    refetch,
  } = useGetEmployeesQuery();

  const {
    data: employeeDetailResponse,
    isLoading: isLoadingDetail,
    error: detailError,
  } = useGetEmployeeDetailQuery(employeeId, {
    skip: !employeeId,
  });

  const employees = useMemo(() => {
    if (!employeesResponse) return [];
    if (Array.isArray(employeesResponse)) return employeesResponse;
    if (employeesResponse.data) return employeesResponse.data;
    if (employeesResponse.results) return employeesResponse.results;
    return [];
  }, [employeesResponse]);

  const employeeDetail = employeeDetailResponse?.data || employeeDetailResponse;

  const [updateEmployee, { isLoading: isUpdating }] = useUpdateEmployeeMutation();
  const [deleteEmployee, { isLoading: isDeleting }] = useDeleteEmployeeMutation();
  const [blockEmployee, { isLoading: isBlocking }] = useBlockEmployeeMutation();
  const [unblockEmployee, { isLoading: isUnblocking }] = useUnblockEmployeeMutation();
  const [inviteEmployee, { isLoading: isInviting }] = useInviteEmployeeMutation();

  return {
    employees,
    employeeDetail,

    isLoadingList,
    isLoadingDetail,

    listError,
    detailError,

    isUpdating,
    isDeleting,
    isBlocking,
    isUnblocking,
    isInviting,

    updateEmployee,
    deleteEmployee,
    blockEmployee,
    unblockEmployee,
    inviteEmployee,

    refetch,
  };
};