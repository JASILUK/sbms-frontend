// Error Bounds UI Boundary Component
export const OverviewErrorState = ({ onRetry, error }) => (
  <div className="mx-auto max-w-md px-4 py-16 text-center space-y-4">
    <div className="h-12 w-12 bg-rose-50 text-rose-600 rounded-full border border-rose-100 flex items-center justify-center mx-auto text-xl font-bold">!</div>
    <h3 className="font-extrabold text-slate-900 text-base">Setup Monitoring Pipeline Disconnected</h3>
    <p className="text-xs text-slate-400 leading-normal max-w-xs mx-auto">
      {error?.data?.message || "Failed to cross-reference infrastructure configurations via multi-tenant endpoints."}
    </p>
    <button 
      onClick={onRetry}
      className="px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm cursor-pointer transition-colors"
    >
      Retry Validation Sync
    </button>
  </div>
);