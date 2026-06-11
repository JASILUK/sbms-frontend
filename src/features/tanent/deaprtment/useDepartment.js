import { useMemo } from 'react';
import { useGetDepartmentsQuery } from './departmentApi';

export const useDepartments = () => {
  const { data: response, isLoading, error } = useGetDepartmentsQuery();
  
  const departments = useMemo(() => {
    if (!response) return [];
    if (Array.isArray(response)) return response;
    if (response.data && Array.isArray(response.data)) return response.data;
    if (response.results && Array.isArray(response.results)) return response.results;
    return [];
  }, [response]);
  
  return {
    departments,
    isLoading,
    error,
  };
};

