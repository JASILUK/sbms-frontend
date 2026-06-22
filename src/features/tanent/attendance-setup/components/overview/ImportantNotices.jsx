
// Important Notices Warnings Component
export const ImportantNotices = ({ notices, isComplete }) => {
  if (isComplete) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl p-4 shadow-3xs flex items-start gap-3">
        <div className="h-2 w-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
        <p className="text-xs font-semibold leading-normal">
          All organizational validation layers are fully mapped. Ready to launch live tracking modules safely.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {notices.slice(0, 2).map((notice) => (
        <div 
          key={notice.id} 
          className={`border rounded-xl p-3.5 shadow-3xs flex items-start gap-3 ${
            notice.level === "critical" 
              ? "bg-rose-50/50 border-rose-100 text-rose-800" 
              : "bg-amber-50/40 border-amber-100 text-amber-800"
          }`}
        >
          <div className={`h-1.5 w-1.5 rounded-full mt-1.5 shrink-0 ${notice.level === "critical" ? "bg-rose-500" : "bg-amber-500"}`} />
          <p className="text-xs leading-normal font-medium">{notice.text}</p>
        </div>
      ))}
    </div>
  );
};