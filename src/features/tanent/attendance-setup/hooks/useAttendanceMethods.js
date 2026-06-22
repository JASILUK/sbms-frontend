import { useCallback, useMemo } from 'react';
import { transformMethodsApiResponse } from '../utils/attendanceMethodsTransformers';
import {
  useGetAttendanceMethodsQuery,
  useReplaceAttendanceMethodsMutation,
  useEnableAttendanceMethodMutation,
  useDisableAttendanceMethodMutation
} from '../api/attendanceMethodsApi';

export function useAttendanceMethods() {
  const { data: rawRes, isLoading, isFetching, error, refetch } = useGetAttendanceMethodsQuery();
  const [replaceMut, { isLoading: isReplacing }] = useReplaceAttendanceMethodsMutation();
  const [enableMut, { isLoading: isEnabling }] = useEnableAttendanceMethodMutation();
  const [disableMut, { isLoading: isDisabling }] = useDisableAttendanceMethodMutation();

  const methods = useMemo(() => transformMethodsApiResponse(rawRes), [rawRes]);
  
  const enabledMethods = useMemo(() => {
    return methods.filter(m => m.is_active).map(m => m.method);
  }, [methods]);

  const replaceMethods = useCallback(async (methodsArray) => {
    return await replaceMut({ methods: methodsArray }).unwrap();
  }, [replaceMut]);

  const enableMethod = useCallback(async (methodName) => {
    return await enableMut(methodName).unwrap();
  }, [enableMut]);

  const disableMethod = useCallback(async (methodName) => {
    return await disableMut(methodName).unwrap();
  }, [disableMut]);

  return {
    methods,
    enabledMethods,
    replaceMethods,
    enableMethod,
    disableMethod,
    isLoading: isLoading || isFetching,
    isUpdating: isReplacing || isEnabling || isDisabling,
    error,
    refetch
  };
}