import { useState, useEffect, useCallback } from 'react';
import { useGetFaceEnrollmentsQuery } from '../api/faceManagementApi';

export function useFaceManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');

  // Persist local state filters out of session variables or simple component instances safely
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 350);
    return () => clearTimeout(handler);
  }, [searchTerm]);

  const queryParams = {
    ...(statusFilter && { status: statusFilter }),
    ...(sourceFilter && { source: sourceFilter })
  };

  const { data: rawData, isLoading, isFetching, error, refetch } = useGetFaceEnrollmentsQuery(queryParams);

  // Perform secure client-side lookup evaluation across the response block for employee strings
  const records = Array.isArray(rawData?.data) 
    ? rawData.data.filter(item => 
        item.employee_username?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : [];

  const metrics = Array.isArray(rawData?.data)
    ? rawData.data.reduce(
        (acc, curr) => {
          if (curr.status === 'PENDING') acc.pending++;
          if (curr.status === 'APPROVED') acc.approved++;
          if (curr.status === 'REJECTED') acc.rejected++;
          if (curr.status === 'REVOKED') acc.revoked++;
          return acc;
        },
        { pending: 0, approved: 0, rejected: 0, revoked: 0 }
      )
    : { pending: 0, approved: 0, rejected: 0, revoked: 0 };

  return {
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    sourceFilter,
    setSourceFilter,
    records,
    metrics,
    isLoading: isLoading || isFetching,
    error,
    refetch
  };
}