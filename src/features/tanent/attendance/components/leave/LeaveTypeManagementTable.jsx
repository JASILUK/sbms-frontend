import React, { useState, useEffect } from "react";
import { Plus, Edit2, ToggleLeft, ToggleRight, Settings, CheckCircle2, XCircle, Info, ChevronDown, ChevronUp, Layers } from "lucide-react";
import { useCreateLeaveTypeMutation, useUpdateLeaveTypeMutation } from "../../api/leaveApi";

export default function LeaveTypeManagementTable({ 
  leaveTypes, isFormOpen, setIsFormOpen, editingType, setEditingType 
}) {
  const [createType, { isLoading: isCreating }] = useCreateLeaveTypeMutation();
  const [updateType, { isLoading: isUpdating }] = useUpdateLeaveTypeMutation();

  // Unified Form State Models
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [quota, setQuota] = useState(12);
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(true);
  const [reqApproval, setReqApproval] = useState(true);
  const [allowHalf, setAllowHalf] = useState(true);
  const [reqAttachment, setReqAttachment] = useState(false);

  // Expanded View ID Tracker State
  const [expandedTypeId, setExpandedTypeId] = useState(null);

  useEffect(() => {
    if (editingType) {
      setName(editingType.name || "");
      setCode(editingType.code || "");
      setQuota(editingType.annual_quota || 0);
      setDescription(editingType.description || "");
      setIsPaid(editingType.is_paid ?? true);
      setReqApproval(editingType.requires_approval ?? true);
      setAllowHalf(editingType.allow_half_day ?? true);
      setReqAttachment(editingType.requires_attachment ?? false);
    } else {
      setName(""); setCode(""); setQuota(12); setDescription("");
      setIsPaid(true); setReqApproval(true); setAllowHalf(true); setReqAttachment(false);
    }
  }, [editingType, isFormOpen]);

  const handleSave = async (e) => {
    e.preventDefault();
    const payload = {
      name,
      code: code.toUpperCase().trim(),
      annual_quota: parseInt(quota, 10),
      description,
      is_paid: isPaid,
      requires_approval: reqApproval,
      allow_half_day: allowHalf,
      requires_attachment: reqAttachment,
    };

    try {
      if (editingType) {
        await updateType({ leaveTypeId: editingType.id, body: payload }).unwrap();
      } else {
        await createType(payload).unwrap();
      }
      setIsFormOpen(false);
      setEditingType(null);
    } catch (err) {
      alert(err?.data?.message || "Error saving policy configuration parameters.");
    }
  };

  const handleToggleActive = async (typeEntity) => {
    try {
      await updateType({
        leaveTypeId: typeEntity.id,
        body: { is_active: !typeEntity.is_active }
      }).unwrap();
    } catch (err) {
      alert(err?.data?.message || "Failed to mutate operational state parameters.");
    }
  };

  const toggleRowExpand = (id) => {
    setExpandedTypeId(expandedTypeId === id ? null : id);
  };

  return (
    <div className="space-y-4 w-full animate-fadeIn">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
        <div>
          <h3 className="text-sm font-bold text-slate-800 tracking-tight flex items-center gap-1.5">
            <Settings className="h-4 w-4 text-slate-500" /> Policy Configurations Framework
          </h3>
          <p className="text-[11px] text-slate-400 font-normal">Define baseline operational entitlement bounds and verification matrices</p>
        </div>
        <button 
          onClick={() => { setEditingType(null); setIsFormOpen(!isFormOpen); }} 
          className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-xl hover:bg-slate-800 transition-all cubic-bezier(0.4, 0, 0.2, 1) duration-200 cursor-pointer shadow-sm"
        >
          <Plus className="h-3.5 w-3.5" /> {isFormOpen ? "Close Panel" : "New Policy Profile"}
        </button>
      </div>

      {/* Form Input Panel */}
      {isFormOpen && (
        <form onSubmit={handleSave} className="bg-slate-50/70 border border-slate-200 p-5 rounded-2xl space-y-4 animate-fadeIn">
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Policy Label Name</label>
              <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sick Leave" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-400 focus:outline-hidden shadow-3xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">System Shorthand Code</label>
              <input type="text" required disabled={!!editingType} value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. SL" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold uppercase focus:ring-1 focus:ring-slate-400 focus:outline-hidden shadow-3xs disabled:bg-slate-100 disabled:text-slate-400" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Baseline Annual Quota</label>
              <input type="number" required value={quota} onChange={(e) => setQuota(e.target.value)} className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono focus:ring-1 focus:ring-slate-400 focus:outline-hidden shadow-3xs" />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Context Description</label>
              <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Policy boundary logic rules..." className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-1 focus:ring-slate-400 focus:outline-hidden shadow-3xs" />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-3 border border-slate-200 rounded-xl shadow-4xs">
            <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg select-none">
              <input type="checkbox" checked={isPaid} onChange={(e) => setIsPaid(e.target.checked)} className="rounded text-slate-900 focus:ring-0" />
              <span className="text-xs text-slate-700 font-medium">Is Paid Leave</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg select-none">
              <input type="checkbox" checked={reqApproval} onChange={(e) => setReqApproval(e.target.checked)} className="rounded text-slate-900 focus:ring-0" />
              <span className="text-xs text-slate-700 font-medium">Requires Review</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg select-none">
              <input type="checkbox" checked={allowHalf} onChange={(e) => setAllowHalf(e.target.checked)} className="rounded text-slate-900 focus:ring-0" />
              <span className="text-xs text-slate-700 font-medium">Allow Half-Day</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg select-none">
              <input type="checkbox" checked={reqAttachment} onChange={(e) => setReqAttachment(e.target.checked)} className="rounded text-slate-900 focus:ring-0" />
              <span className="text-xs text-slate-700 font-medium">Mandate Upload</span>
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => { setIsFormOpen(false); setEditingType(null); }} className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-50 cursor-pointer">Cancel</button>
            <button type="submit" disabled={isCreating || isUpdating} className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl shadow-xs disabled:opacity-40 cursor-pointer">
              {editingType ? "Commit Changes" : "Initialize Policy"}
            </button>
          </div>
        </form>
      )}

      {/* Main Data Ledger Table */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-3xs">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              <th className="p-3">Specification Label</th>
              <th className="p-3">Code</th>
              <th className="p-3">Annual Baseline</th>
              <th className="p-3">Operational Status</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50 text-xs text-slate-700">
            {leaveTypes.map((type) => {
              const isExpanded = expandedTypeId === type.id;
              return (
                <React.Fragment key={type.id}>
                  <tr className={`transition-colors duration-150 ${isExpanded ? "bg-slate-50/50" : "hover:bg-slate-50/30"}`}>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900">{type.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">ID: #{type.id}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-500">
                      <span className="bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-md text-[10px]">{type.code}</span>
                    </td>
                    <td className="p-3 font-mono font-bold text-slate-800">{type.annual_quota} days</td>
                    <td className="p-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-bold border tracking-wide uppercase ${
                        type.is_active ? "bg-emerald-50 text-emerald-700 border-emerald-100" : "bg-slate-100 text-slate-400 border-slate-200"
                      }`}>
                        {type.is_active ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {/* ✅ INLINE EXTENSION TRIGGER FOR DETAIL SCREEN VIEW */}
                        <button 
                          onClick={() => toggleRowExpand(type.id)}
                          className={`p-1.5 rounded-lg border text-slate-500 hover:text-slate-900 transition-all cursor-pointer ${
                            isExpanded ? "bg-slate-100 border-slate-300" : "bg-white border-slate-200 hover:bg-slate-50"
                          }`}
                          title="View Technical Details Schema"
                        >
                          {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                        </button>

                        <button onClick={() => { setEditingType(type); setIsFormOpen(true); }} className="p-1.5 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-500 cursor-pointer" title="Edit Configuration"><Edit2 className="h-3.5 w-3.5" /></button>
                        
                        <button 
                          type="button" 
                          onClick={() => handleToggleActive(type)} 
                          className={`p-1.5 rounded-lg transition-colors cursor-pointer ${type.is_active ? "text-emerald-600 hover:bg-emerald-50" : "text-slate-400 hover:bg-slate-100"}`}
                          title={type.is_active ? "Click to Deactivate" : "Click to Activate"}
                        >
                          {type.is_active ? <ToggleRight className="h-5 w-5" /> : <ToggleLeft className="h-5 w-5" />}
                        </button>
                      </div>
                    </td>
                  </tr>

                  {/* ✅ THE EXPANDED INLINE DETAIL CANVAS HUD VIEW */}
                  {isExpanded && (
                    <tr className="bg-slate-50/40">
                      <td colSpan="5" className="p-4 border-t border-b border-slate-100">
                        <div className="bg-white border border-slate-200/60 rounded-xl p-4 shadow-4xs space-y-3 animate-slideDown">
                          <div className="flex items-center gap-1.5 text-slate-400 border-b border-slate-100 pb-1.5">
                            <Layers className="h-3.5 w-3.5 text-indigo-500" />
                            <span className="text-[10px] font-black uppercase tracking-wider font-mono">Structural Rules Snapshot Overview</span>
                          </div>
                          
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-1">
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wide">Payroll Evaluation</span>
                              <span className={`text-xs font-semibold ${type.is_paid ? "text-emerald-600" : "text-rose-500"}`}>
                                {type.is_paid ? "✓ Paid Entitlement" : "✗ Unpaid Loss of Pay"}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wide">Review Stage Gates</span>
                              <span className="text-xs text-slate-700 font-semibold">
                                {type.requires_approval ? "✓ Multi-tier Approval Guard" : "✗ Auto-approve Validation"}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wide">Shift Scheduling Exception</span>
                              <span className="text-xs text-slate-700 font-semibold">
                                {type.allow_half_day ? "✓ Half-Day Partitions Supported" : "✗ Full Day Bounds Only"}
                              </span>
                            </div>
                            <div className="space-y-0.5">
                              <span className="text-[9px] font-bold uppercase text-slate-400 block tracking-wide">Compliance Documentation</span>
                              <span className="text-xs text-slate-700 font-semibold">
                                {type.requires_attachment ? "✓ Attachment Certificate Mandated" : "✗ Optional Proof Upload"}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-slate-50 space-y-0.5">
                            <span className="text-[9px] font-bold uppercase text-slate-400 tracking-wide flex items-center gap-1"><Info className="h-2.5 w-2.5" /> Policy Objective Summary</span>
                            <p className="text-xs text-slate-600 font-normal leading-relaxed">{type.description || "No supplemental explanatory description strings appended to this model object metadata record."}</p>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}