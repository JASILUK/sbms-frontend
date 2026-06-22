// attendance-setup/components/overview/QuickActions.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Zap } from "lucide-react";

export const QuickActions = ({ checklist }) => {
  const navigate = useNavigate();
  const pendingItems = checklist.filter(item => !item.isCompleted);

  if (pendingItems.length === 0) return null;

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-3xs space-y-4">
      <div className="flex items-center gap-2 text-slate-800">
        <Zap className="h-4 w-4 text-amber-500 shrink-0" />
        <h4 className="font-bold text-sm">Suggested Task Flows</h4>
      </div>
      <div className="flex flex-col gap-2">
        {pendingItems.map(item => (
          <button
            key={item.id}
            onClick={() => navigate(item.path)}
            className="w-full inline-flex items-center justify-between px-3 py-2 border border-slate-100 hover:border-slate-200 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer text-left transition-all"
          >
            <span>{item.title.replace("Configure ", "Set Up ")}</span>
            <PlusCircle className="h-3.5 w-3.5 text-indigo-500 shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
};

