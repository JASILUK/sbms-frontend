import { useState, useCallback, useMemo } from 'react';
import { transformLocationsListResponse } from '../utils/attendanceLocationTransformers';
import {
  useGetAttendanceLocationsQuery,
  useCreateAttendanceLocationMutation,
  useUpdateAttendanceLocationMutation,
  useDeactivateAttendanceLocationMutation,
  useActivateAttendanceLocationMutation
} from '../api/attendanceLocationsApi';

export function useAttendanceLocations(filters = {}) {
  const [activeLocationId, setActiveLocationId] = useState(null);

  const queryParams = useMemo(() => ({
    search: filters.search || undefined,
    activeOnly: filters.status === 'active' ? true : filters.status === 'inactive' ? false : undefined
  }), [filters.search, filters.status]);

  const { data: rawRes, isLoading, isFetching, error, refetch } = useGetAttendanceLocationsQuery(queryParams);
  const [createMut, { isLoading: isCreating }] = useCreateAttendanceLocationMutation();
  const [updateMut, { isLoading: isUpdating }] = useUpdateAttendanceLocationMutation();
  const [deactivateMut, { isLoading: isDeactivating }] = useDeactivateAttendanceLocationMutation();
  const [activateMut, { isLoading: isActivating }] = useActivateAttendanceLocationMutation();

  const locations = useMemo(() => transformLocationsListResponse(rawRes), [rawRes]);

  const selectedLocation = useMemo(() => {
    if (!activeLocationId) return null;
    return locations.find(loc => loc.id === activeLocationId) || null;
  }, [activeLocationId, locations]);

  const createLocation = useCallback(async (payload) => await createMut(payload).unwrap(), [createMut]);
  const updateLocation = useCallback(async (id, payload) => await updateMut({ id, ...payload }).unwrap(), [updateMut]);
  const deactivateLocation = useCallback(async (id) => await deactivateMut(id).unwrap(), [deactivateMut]);
  const activateLocation = useCallback(async (id) => await activateMut(id).unwrap(), [activateMut]);

  return {
    locations,
    selectedLocation,
    setActiveLocationId,
    isLoading: isLoading || isFetching,
    isUpdating: isCreating || isUpdating || isDeactivating || isActivating,
    error,
    createLocation,
    updateLocation,
    activateLocation,
    deactivateLocation,
    refetch
  };
}