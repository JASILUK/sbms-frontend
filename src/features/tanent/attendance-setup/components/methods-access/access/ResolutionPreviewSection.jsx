import React, { useState } from 'react';
import { Search, Eye, Compass } from 'lucide-react';
import { useAttendanceResolution } from '../../../hooks/useAttendanceResolution';
import { ResolutionResultCard } from './ResolutionResultCard';

export function ResolutionPreviewSection({ employeesPool }) {
  const [targetId, setTargetId] = useState('');
  const { resolvedMatrixOutput, isResolving, resolutionError, executeResolutionTrace } = useAttendanceResolution();

  const handleRunSimulationTrace = () => {
    if (!targetId) return;
    executeResolutionTrace(targetId);
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-2xs space-y-5 text-xs font-medium text-slate-700 animate-fadeIn">
      <div className="space-y-0.5 border-b border-slate-100 pb-3">
        <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
          <Compass className="h-4 w-4 text-slate-600" />
          Attendance Policy Precedence Hierarchy Resolution Simulator
        </h3>
        <p className="text-[11px] text-slate-400 font-medium">Evaluate cascading prioritization layers at runtime by isolating distinct corporate registry member nodes profiles keys.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-3 p-4 border border-slate-200 bg-slate-50 rounded-xl">
        <div className="flex-1 space-y-1">
          <label className="font-bold text-slate-800 block flex items-center gap-1"><Search className="h-3.5 w-3.5 text-slate-400" /> Select Employee Strategy Registry Pivot Target</label>
          <select
            value={targetId}
            onChange={(e) => setTargetId(e.target.value)}
            className="w-full p-2 border border-slate-200 bg-white rounded-lg focus:outline-none font-bold text-slate-900 shadow-2xs"
          >
            <option value="">-- Choose Corporate Employee Record Target Line --</option>
            {employeesPool.map(e => (
              <option key={e.id} value={e.id}>{e.username} ({e.user_email}) — Job Title Anchor: {e.job_title || 'Staff'}</option>
            ))}
          </select>
        </div>
        <button
          type="button"
          disabled={isResolving || !targetId}
          onClick={handleRunSimulationTrace}
          className="inline-flex items-center justify-center px-4 py-2 text-white bg-slate-900 hover:bg-slate-800 rounded-lg font-bold gap-1 shadow-sm transition-colors h-9 disabled:opacity-40"
        >
          <Eye className="h-4 w-4" /> {isResolving ? 'Computing Precendence Matrix...' : 'Run Simulation Trace'}
        </button>
      </div>

      {resolutionError && (
        <div className="p-3 bg-red-50 border border-red-100 text-red-700 rounded-xl font-bold">
          Pipeline execution runtime aborted. Verification engine returned error processing matrix variables queries profiles.
        </div>
      )}

      {resolvedMatrixOutput && <ResolutionResultCard result={resolvedMatrixOutput} />}
    </div>
  );
}