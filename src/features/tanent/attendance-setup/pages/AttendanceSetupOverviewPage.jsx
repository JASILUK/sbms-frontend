// attendance-setup/pages/AttendanceSetupOverviewPage.jsx
import React from "react";
import { useAttendanceSetupOverview } from "../hooks/useAttendanceSetupOverview";

import { SetupHeader } from "../components/overview/SetupHeader";
import { SetupProgressCard } from "../components/overview/SetupProgressCard";
import { SetupStatusGrid } from "../components/overview/SetupStatusGrid";
import { QuickActions } from "../components/overview/QuickActions";
import { SetupChecklist } from "../components/overview/SetupChecklist";
import { SnapshotCard } from "../components/overview/SnapshotCard";
import { ImportantNotices } from "../components/overview/ImportantNotices";
import { GettingStartedResources } from "../components/overview/GettingStartedResources";
import { OverviewSkeleton } from "../components/overview/OverviewSkeleton";
import { OverviewErrorState } from "../components/overview/OverviewErrorState";

export default function AttendanceSetupOverviewPage() {
  const { isLoading, error, refetch, modulesState, checklist, notices } = useAttendanceSetupOverview();

  if (isLoading) return <OverviewSkeleton />;
  if (error) return <OverviewErrorState onRetry={refetch} error={error} />;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 space-y-8 select-none transition-all duration-300">
      {/* Structural Page Header Context Controller */}
      <SetupHeader isReady={modulesState.isSetupComplete} />

      {/* Hero Performance Score Tracking Panel */}
      <SetupProgressCard score={modulesState.score} count={modulesState.configuredCount} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Core Administrative Parameters Grid Interface */}
        <div className="lg:col-span-2 space-y-8">
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider -mb-4">Module Setup Parameters</h2>
          <SetupStatusGrid modules={modulesState} />
          
          <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider -mb-4">Operational Onboarding Tracker</h2>
          <SetupChecklist items={checklist} />
        </div>

        {/* Action Panel and Operational Metadata Snapshot Panels */}
        <div className="space-y-8">
          <QuickActions checklist={checklist} />
          <SnapshotCard modules={modulesState} />
          <ImportantNotices notices={notices} isComplete={modulesState.isSetupComplete} />
          <GettingStartedResources />
        </div>
      </div>
    </main>
  );
}