import { useCallback, useState } from "react";
import { toast } from "sonner";
// 1. Change useGetHRRecordDetailQuery to useRunHRRecordActionMutation here:
import { useRunHRRecordActionMutation, useOverrideHRPunchMutation } from "../../api/hrAttendanceManagementApi";

const ACTION_LABELS = {
  finalize: "Finalize",
  unlock: "Unlock",
  reprocess: "Reprocess",
};

export function useAttendanceActions() {
  // 2. Update this line to use the mutation hook instead:
  const [runAction, { isLoading: isActionRunning }] = useRunHRRecordActionMutation();
  const [overridePunch, { isLoading: isOverrideRunning }] = useOverrideHRPunchMutation();
  const [pendingAction, setPendingAction] = useState(null); // { id, action }

  const requestAction = useCallback((id, action) => {
    setPendingAction({ id, action });
  }, []);

  const cancelAction = useCallback(() => setPendingAction(null), []);

  const confirmAction = useCallback(async () => {
    if (!pendingAction) return;
    const { id, action } = pendingAction;
    const label = ACTION_LABELS[action] || action;
    try {
      await runAction({ id, action }).unwrap();
      toast.success(`${label} completed`, {
        description: `Attendance record #${id} was updated successfully.`,
      });
    } catch (err) {
      toast.error(`${label} failed`, {
        description: err?.data?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setPendingAction(null);
    }
  }, [pendingAction, runAction]);

  const submitOverride = useCallback(
    async (payload) => {
      try {
        await overridePunch(payload).unwrap();
        toast.success("Manual punch override applied");
        return true;
      } catch (err) {
        toast.error("Override failed", {
          description: err?.data?.message || "Could not apply the manual correction.",
        });
        return false;
      }
    },
    [overridePunch]
  );

  return {
    pendingAction,
    requestAction,
    cancelAction,
    confirmAction,
    isActionRunning,
    submitOverride,
    isOverrideRunning,
  };
}