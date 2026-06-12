import { useGetDepartmentsQuery } from "../deaprtment/departmentApi"
import { useGetRolesQuery } from "../Roles/rolesApi"

export function useEmployeeFormData() {

  const { data: departmentsData, isLoading: deptLoading } =
    useGetDepartmentsQuery()

  const { data: rolesData, isLoading: roleLoading } =
    useGetRolesQuery()

  const departments = departmentsData?.data || []
  const roles = rolesData?.data || []

  return {
    departments,
    roles,
    isLoading: deptLoading || roleLoading
  }
}