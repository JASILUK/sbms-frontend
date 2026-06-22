import React, { useState } from "react";
import { FormProvider } from "react-hook-form";
import { toast } from "sonner";
import {
  useGetAttendancePolicyQuery,
  useResetAttendancePolicyMutation,
} from "../api/attendanceSetupApi";
import { useAttendancePolicyForm } from "../hooks/useAttendancePolicyForm";
import { PolicySkeleton } from "../components/policies/PolicySkeleton";
import { PolicyHeader } from "../components/policies/PolicyHeader";
import { PolicyOverviewCard } from "../components/policies/PolicyOverviewCard";
import { WorkRulesCard } from "../components/policies/WorkRulesCard";
import { AttendanceThresholdCard } from "../components/policies/AttendanceThresholdCard";
import { OvertimeCard } from "../components/policies/OvertimeCard";
import { AutomationCard } from "../components/policies/AutomationCard";
import { PolicyStatusCard } from "../components/policies/PolicyStatusCard";
import { ResetPolicyDialog } from "../components/policies/ResetPolicyDialog";
import { SaveActions } from "../components/policies/SaveActions";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function AttendancePolicyPage() {
  // 1. Alias the incoming network payload to clearly distinguish it from the inner entity data
  const { data: responseBody, isLoading, error, refetch } = useGetAttendancePolicyQuery();
  const [resetAttendancePolicy, { isLoading: isResetting }] = useResetAttendancePolicyMutation();
  const [isResetOpen, setIsResetOpen] = useState(false);

  // 2. Safely extract the inner operational settings structure from the response envelope
  const policy = responseBody?.data;

  // 3. Forward the exact object reference to drive the react-hook-form initialization
  const { methods, onSubmit, isSaving } = useAttendancePolicyForm(policy, refetch);

  const handleResetConfirm = async () => {
    try {
      await resetAttendancePolicy().unwrap();
      toast.success("Attendance policies reverted to framework operational defaults.");
      setIsResetOpen(false);
      refetch();
    } catch (err) {
      toast.error("Failed to reset organizational rules to system default limits.");
    }
  };

  if (isLoading) return <PolicySkeleton />;

  if (error) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-600 border border-red-100 shadow-sm">
          <AlertCircle className="h-5 w-5" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900">Unable to load attendance policy</h3>
        <p className="mt-2 text-sm text-slate-500">
          The processing node failed to return configuration profiles. Verify tenant parameters and retry.
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-6 inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
        >
          <RefreshCw className="h-4 w-4" />
          Retry Processing
        </button>
      </div>
    );
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      {/* 4. Pass down values extracted from the inner data object wrapper */}
      <PolicyHeader isActive={policy?.is_active} updatedAt={policy?.updated_at || policy?.created_at} />
      
      <PolicyOverviewCard policy={policy} />

      <FormProvider {...methods}>
        <form onSubmit={onSubmit} className="space-y-8 pb-28">
          <WorkRulesCard />
          <AttendanceThresholdCard />
          <OvertimeCard />
          <AutomationCard />
          <PolicyStatusCard />
          
          <SaveActions
            isSaving={isSaving}
            onTriggerReset={() => setIsResetOpen(true)}
          />
        </form>
      </FormProvider>

      <ResetPolicyDialog
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onConfirm={handleResetConfirm}
        isResetting={isResetting}
      />
    </main>
  );
}