import { useNavigate } from "react-router-dom";

// Checklist Component
export const SetupChecklist = ({ items }) => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-3xs divide-y divide-slate-100">
      {items.map((item) => (
        <div key={item.id} className="p-4 flex items-start gap-4 hover:bg-slate-50/30 transition-colors">
          <div className="pt-0.5 shrink-0">
            {item.isCompleted ? (
              <div className="h-4 w-4 rounded-full bg-emerald-500 flex items-center justify-center text-white text-[10px] shadow-3xs">✓</div>
            ) : (
              <div className="h-4 w-4 rounded-full border-2 border-slate-300 bg-white" />
            )}
          </div>
          <div className="flex-1 space-y-0.5">
            <h5 className={`text-xs font-bold ${item.isCompleted ? "text-slate-500 line-through" : "text-slate-800"}`}>{item.title}</h5>
            <p className="text-xs text-slate-400 max-w-xl leading-normal">{item.description}</p>
          </div>
          <button 
            onClick={() => navigate(item.path)}
            className="px-2.5 py-1 text-[11px] font-bold border border-slate-200 bg-white hover:bg-slate-50 text-slate-600 rounded-md shadow-3xs cursor-pointer transition-colors"
          >
            Build
          </button>
        </div>
      ))}
    </div>
  );
};