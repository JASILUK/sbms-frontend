// pages/DepartmentListPage.jsx
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import DepartmentHeader from "./component/Department_Header";
import DepartmentStats from "./component/Department_states";
import DepartmentTable from "./component/departmentTable";
import DepartmentFormModal from "./component/Department_FormMOdal";

export default function DepartmentListPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  return (
    <div className="min-h-screen relative bg-[#F8FAFC] overflow-x-hidden">
      {/* Premium layered background - fixed position */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/40" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-100/30 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-blue-50/40 blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.015]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 pb-20">
        {/* HEADER */}
        <DepartmentHeader
          onCreate={() => {
            setEditing(null);
            setShowForm(true);
          }}
        />

        {/* STATS */}
        <DepartmentStats />

        {/* TABLE */}
        <DepartmentTable
          onCreate={() => {
            setEditing(null);
            setShowForm(true);
          }}
          onEdit={(department) => {
            setEditing(department);
            setShowForm(true);
          }}
          onView={(id) => {
            navigate(`/app/departments/${id}`);
          }}
        />
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {showForm && (
          <DepartmentFormModal
            key={editing?.id || "create"}
            isOpen={showForm}
            department={editing}
            onClose={() => {
              setShowForm(false);
              setEditing(null);
            }}
            onSuccess={() => {
              setShowForm(false);
              setEditing(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}