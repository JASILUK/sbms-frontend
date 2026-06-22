import { useState, useCallback } from 'react';
import { useLazyEvaluatePolicyMatrixResolutionQuery } from '../api/attendanceAccessApi';

export function useAttendanceResolution() {
  const [activeEvaluatedTargetId, setActiveEvaluatedTargetId] = useState('');
  const [triggerResolutionEvaluation, { data: resData, isFetching: isResolving, error: resolutionError }] = useLazyEvaluatePolicyMatrixResolutionQuery();

  const executeResolutionTrace = useCallback(async (membershipId) => {
    if (!membershipId) return null;
    setActiveEvaluatedTargetId(membershipId);
    return await triggerResolutionEvaluation(membershipId).unwrap();
  }, [triggerResolutionEvaluation]);

  return {
    activeEvaluatedTargetId,
    resolvedMatrixOutput: resData?.data || resData || null,
    isResolving,
    resolutionError,
    executeResolutionTrace,
    resetResolutionState: () => setActiveEvaluatedTargetId('')
  };
}