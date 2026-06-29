import React, { useState } from "react";
import { useLeave } from "../hooks/useLeave";
import { usePermission } from "../../../auth/usePermission";
import LeaveStatisticsCards from "../components/leave/LeaveStatisticsCards";
import LeaveBalanceCards from "../components/leave/LeaveBalanceCards";
import LeaveCalendar from "../components/leave/LeaveCalendar";
import LeaveFilters from "../components/leave/LeaveFilters";
import LeaveRequestList from "../components/leave/LeaveRequestList";
import LeaveRequestForm from "../components/leave/LeaveRequestForm";
import LeaveRequestDetail from "../components/leave/LeaveRequestDetail";
import LeaveTypeManagementTable from "../components/leave/LeaveTypeManagementTable";
import LeaveEmployeeDirectory from "../components/leave/LeaveEmployeeDirectory";
import { RefreshCw, ClipboardList, SlidersHorizontal, Plus, ArrowLeft, Shield, X, HelpCircle } from "lucide-react";

export default function LeavesPage() {
  const { hasPermission } = usePermission();
  const isHR = hasPermission("tenant.attendance.manage") || false;

  const {
    activeTab, adminSubTab, isFiltersOpen, selectedLeaveId, isFormOpen, isDetailOpen,
    isTypeFormOpen, editingType, selectedEmployeeId, calendarSelection, year, statusFilter,
    myBalances, myRequests, hrRequests, hrStatistics, leaveTypes, employeesList,currentMonth,
    drillBalances, drillRequests, isLoading, isAdjustmentModalOpen, selectedBalanceRow, isAdjustingLog,
    adjustLeaveBalance, setIsAdjustmentModalOpen, setSelectedBalanceRow, setAdminSubTab, 
    setIsFiltersOpen, setSelectedLeaveId, setIsFormOpen, setIsDetailOpen, setIsTypeFormOpen, 
    setEditingType, setSelectedEmployeeId, setCalendarSelection, handleTabChange, handleApplyFilters, 
    handleResetFilters, handleRefreshAll,handleMonthChange
  } = useLeave();

  // Adjustment Modal Form Hooks
  const [daysInput, setDaysInput] = useState("");
  const [reasonInput, setReasonInput] = useState("");

  const commitAdjustment = async (e) => {
    e.preventDefault();
    try {
      await adjustLeaveBalance({
        balanceId: selectedBalanceRow.id,
        body: { adjustment_days: parseFloat(daysInput), reason: reasonInput }
      }).unwrap();
      setIsAdjustmentModalOpen(false);
      setDaysInput(""); setReasonInput("");
      handleRefreshAll();
    } catch (err) {
      alert(err?.data?.message || "Adjustment failed.");
    }
  };

  return (
    <div className="w-full min-h-screen bg-slate-50/60 p-4 sm:p-6 space-y-6 animate-fadeIn font-sans selection:bg-indigo-100">
      
      {/* Header Panel */}
      <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
        <div className="space-y-1">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1 text-[10px] font-black uppercase text-slate-400 font-mono tracking-widest">
            <span>Home</span><span>/</span><span>Attendance</span><span>/</span><span className="text-slate-600">Leave Console</span>
          </nav>
          <h1 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-slate-800" /> Leave Management Platform
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {isHR && (
            <div className="flex bg-slate-100 p-0.5 border border-slate-200 rounded-xl mr-2 shadow-3xs">
              <button onClick={() => handleTabChange("my-leaves")} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${activeTab === "my-leaves" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-400 hover:text-slate-600"}`}>Self Portal</button>
              <button onClick={() => handleTabChange("team-leaves")} className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${activeTab === "team-leaves" ? "bg-white text-slate-900 shadow-3xs" : "text-slate-400 hover:text-slate-600"}`}>HR Desk</button>
            </div>
          )}
          {activeTab === "my-leaves" && (
            <button onClick={() => { setCalendarSelection({ start: null, end: null }); setIsFormOpen(true); }} className="inline-flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"><Plus className="h-3.5 w-3.5" />Apply Leave</button>
          )}
          <button onClick={handleRefreshAll} disabled={isLoading} className="p-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-600 rounded-xl shadow-3xs cursor-pointer"><RefreshCw className={`h-3.5 w-3.5 ${isLoading ? "animate-spin" : ""}`} /></button>
        </div>
      </div>

      {activeTab === "team-leaves" && isHR && !selectedEmployeeId && (
        <div className="flex items-center gap-2 border-b border-slate-200 pb-2 font-sans">
          <button onClick={() => setAdminSubTab("requests")} className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${adminSubTab === "requests" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}>Incoming Applications</button>
          <button onClick={() => setAdminSubTab("leave-types")} className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${adminSubTab === "leave-types" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}>Policy Configurations</button>
          <button onClick={() => setAdminSubTab("employees")} className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${adminSubTab === "employees" ? "border-slate-900 text-slate-900" : "border-transparent text-slate-400 hover:text-slate-600"}`}>Employee Ledgers</button>
        </div>
      )}

      {isLoading && myRequests.length === 0 ? (
        <div className="space-y-4 animate-pulse"><div className="h-24 bg-white border border-slate-100 rounded-2xl" /><div className="h-64 bg-white border border-slate-100 rounded-2xl" /></div>
      ) : (
        <div className="space-y-6">
          {activeTab === "team-leaves" && isHR && selectedEmployeeId ? (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between">
                <button onClick={() => setSelectedEmployeeId(null)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 text-slate-700 font-bold text-xs rounded-xl shadow-3xs hover:bg-slate-50 cursor-pointer"><ArrowLeft className="h-3.5 w-3.5" />Back to Roster Directory</button>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-bold font-mono"><Shield className="h-3.5 w-3.5 text-indigo-500" />SECURE PROFILE DRILL-DOWN ACCESS</div>
              </div>
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wide px-1">Inspecting Employee Balance & Allocation History</h2>
              
              {/* Pass down trigger references to allow balance tuning overrides */}
              <LeaveBalanceCards 
                balances={drillBalances} 
                isHRMode={true} 
                onTriggerAdjust={(row) => { setSelectedBalanceRow(row); setIsAdjustmentModalOpen(true); }} 
              />
              
              <div className="bg-white p-4 border border-slate-200 rounded-2xl space-y-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider">Employee Written Petitions History Ledger</h3>
                <LeaveRequestList records={drillRequests} onOpenDetail={(id) => { setSelectedLeaveId(id); setIsDetailOpen(true); }} />
              </div>
            </div>
          ) : (
            <>
              {activeTab === "team-leaves" && isHR ? (
                adminSubTab === "requests" && <LeaveStatisticsCards statistics={hrStatistics} />
              ) : (
                <LeaveBalanceCards balances={myBalances} isHRMode={false} />
              )}

              {activeTab === "team-leaves" && isHR && adminSubTab === "leave-types" ? (
                <LeaveTypeManagementTable leaveTypes={leaveTypes} isFormOpen={isTypeFormOpen} setIsFormOpen={setIsTypeFormOpen} editingType={editingType} setEditingType={setEditingType} />
              ) : activeTab === "team-leaves" && isHR && adminSubTab === "employees" ? (
                <LeaveEmployeeDirectory employees={employeesList} onSelectEmployee={setSelectedEmployeeId} />
              ) : (
                <div className="space-y-6">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-wider px-1">Active Leave Transactions Ledger</h3>
                    <button onClick={() => setIsFiltersOpen(v => !v)} className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-slate-200 text-[11px] font-bold text-slate-600 rounded-xl shadow-3xs hover:bg-slate-50 cursor-pointer"><SlidersHorizontal className="h-3 w-3" />Filters Matrix</button>
                  </div>
                  <LeaveFilters isOpen={isFiltersOpen} leaveTypes={leaveTypes} onApply={handleApplyFilters} onReset={handleResetFilters} />
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start w-full">
                    <div className="lg:col-span-2">
                      <LeaveRequestList records={activeTab === "team-leaves" ? hrRequests : myRequests} onOpenDetail={(id) => { setSelectedLeaveId(id); setIsDetailOpen(true); }} />
                    </div>
                    <div className="lg:col-span-1">
                        <LeaveCalendar 
                        requests={myRequests} 
                        currentMonth={currentMonth} 
                        currentYear={year} 
                        onMonthChange={handleMonthChange} 
                        onSelectRange={(start, end) => { 
                            // Block selection of past days when clicking on the calendar cells
                            const todayStr = new Date().toISOString().split("T")[0];
                            if (start < todayStr) {
                            alert("Cannot apply for leaves on past dates.");
                            return;
                            }
                            setCalendarSelection({ start, end }); 
                            setIsFormOpen(true); 
                        }} 
                        />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Adjust Pool Days Modal Form */}
      {isAdjustmentModalOpen && selectedBalanceRow && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-3xs" onClick={() => setIsAdjustmentModalOpen(false)} />
          <form onSubmit={commitAdjustment} className="bg-white border border-slate-200 rounded-2xl max-w-sm w-full p-5 space-y-4 relative z-10 shadow-2xl animate-scaleIn animate-duration-150">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <div>
                <h3 className="text-sm font-black text-slate-900">Adjust Entitlement Pool</h3>
                <p className="text-[10px] font-mono text-slate-400 font-bold uppercase">{selectedBalanceRow.leave_type?.code} Balance</p>
              </div>
              <button type="button" onClick={() => setIsAdjustmentModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600 cursor-pointer"><X className="h-4 w-4" /></button>
            </div>
            
            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Adjustment Delta Days</label>
                <input type="number" step="0.5" required value={daysInput} onChange={(e) => setDaysInput(e.target.value)} placeholder="Use positive numbers to grant or negative numbers to deduct (e.g. 5 or -2)" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Justification Audit Note</label>
                <input type="text" required value={reasonInput} onChange={(e) => setReasonInput(e.target.value)} placeholder="e.g. Mid-year contract bonus allocation adjustment" className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl" />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 flex justify-end gap-2">
              <button type="button" onClick={() => setIsAdjustmentModalOpen(false)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-500 hover:bg-slate-100 text-xs cursor-pointer">Dismiss</button>
              <button type="submit" disabled={isAdjustingLog} className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow-xs cursor-pointer disabled:opacity-40">Commit Adjust</button>
            </div>
          </form>
        </div>
      )}

      <LeaveRequestForm isOpen={isFormOpen} leaveTypes={leaveTypes} prefilledDates={calendarSelection} onClose={() => setIsFormOpen(false)} />
      <LeaveRequestDetail requestId={selectedLeaveId} isHR={activeTab === "team-leaves" && isHR} onClose={() => { setSelectedLeaveId(null); setIsDetailOpen(false); }} />
    </div>
  );
}