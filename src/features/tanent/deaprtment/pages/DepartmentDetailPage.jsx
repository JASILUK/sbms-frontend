// pages/DepartmentDetailPage.jsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Users,
  GitBranch,
  Crown,
  Pencil,
  ChevronRight,
  Loader2,
} from "lucide-react";
import {
  useGetDepartmentDetailQuery,
  useUpdateDepartmentMutation,
  useRemoveDepartmentMemberMutation,
  useTransferDepartmentMemberMutation,
} from "../departmentApi";
import DepartmentMembersSection from "../pages/component/DepartmentMembersSection";
import AssignMembersModal from "../pages/component/AssignMembersModal";
import TransferMemberModal from "../pages/component/TransferMemberModal";
import DepartmentFormModal from "../pages/component/Department_FormMOdal";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function DepartmentDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);

  const { data, isLoading, isFetching } = useGetDepartmentDetailQuery(id);
  const [updateDepartment, { isLoading: updatingDepartment }] = useUpdateDepartmentMutation();
  const [removeMember, { isLoading: removingMember }] = useRemoveDepartmentMemberMutation();
  const [transferMember, { isLoading: transferringMember }] = useTransferDepartmentMemberMutation();

  const department = data?.data;

  if (isLoading) {
    return <DetailPageSkeleton />;
  }

  if (!department) {
    return <NotFoundState onBack={() => navigate(-1)} />;
  }

  const handleRemoveMember = async (member) => {
    const confirmed = window.confirm(`Remove ${member.name} from this department?`);
    if (!confirmed) return;
    try {
      await removeMember({
        departmentId: department.id,
        membershipId: member.membership_id,
      }).unwrap();
    } catch (error) {
      console.error("Failed to remove member", error);
    }
  };

  const handleMakeHead = async (member) => {
    try {
      await updateDepartment({
        id: department.id,
        data: { head_membership_id: member.membership_id },
      }).unwrap();
    } catch (error) {
      console.error("Failed to update department head", error);
    }
  };

  const handleTransfer = (member) => {
    setSelectedMember(member);
    setShowTransferModal(true);
  };

  const handleTransferSubmit = async ({ membershipId, toDepartmentId }) => {
    try {
      await transferMember({
        fromDepartmentId: department.id,
        membershipId,
        toDepartmentId,
      }).unwrap();
      setShowTransferModal(false);
      setSelectedMember(null);
    } catch (error) {
      console.error("Transfer failed", error);
    }
  };

  return (
    <div className="min-h-screen relative bg-[#F8FAFC] overflow-x-hidden">
      {/* Premium layered background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-violet-50/30" />
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-violet-100/25 blur-3xl" />
        <div className="absolute top-1/2 -left-40 w-[400px] h-[400px] rounded-full bg-blue-50/30 blur-3xl" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-amber-50/20 blur-3xl" />
        <div 
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8 pb-20"
      >
        {/* HEADER */}
        <motion.div variants={itemVariants} className="relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 mb-4 sm:mb-5">
            <button
              onClick={() => navigate('/app/departments')}
              className="text-[0.75rem] font-medium text-gray-400 hover:text-gray-600 transition-colors"
            >
              Departments
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-gray-300" strokeWidth={2} />
            <span className="text-[0.75rem] font-semibold text-gray-700 truncate max-w-[200px]">
              {department.name}
            </span>
          </nav>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 sm:gap-6">
            <div className="flex items-start gap-3.5 sm:gap-4">
              <motion.div
                whileHover={{ scale: 1.05, rotate: 2 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="relative flex-shrink-0"
              >
                <div className="absolute inset-0 bg-violet-500/20 rounded-2xl blur-xl scale-150" />
                <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-violet-500 via-violet-600 to-indigo-600 shadow-lg shadow-violet-500/25 flex items-center justify-center">
                  <Building2 className="w-6 h-6 sm:w-7 sm:h-7 text-white" strokeWidth={1.5} />
                </div>
              </motion.div>

              <div className="pt-0.5 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight leading-tight">
                  {department.name}
                </h1>
                <p className="text-sm sm:text-[0.9rem] text-gray-500 mt-1 leading-relaxed">
                  Department Management & Team Overview
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0">
              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate(-1)}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 text-sm font-medium text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all duration-200 shadow-sm"
              >
                <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                Back
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.03, y: -1 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setShowEditModal(true)}
                className="group inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-violet-600 via-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/30 hover:shadow-violet-500/40 transition-all duration-300"
              >
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Pencil className="w-4 h-4 relative z-10" strokeWidth={2} />
                <span className="relative z-10">Edit</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* BREADCRUMB / HIERARCHY PATH */}
        {department.path && department.path.length > 0 && (
          <motion.div variants={itemVariants}>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-4 sm:p-5">
              <p className="text-[0.7rem] font-semibold text-gray-400 uppercase tracking-[0.08em] mb-3">
                Organization Hierarchy
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                {department.path.map((item, index) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      onClick={() => navigate(`/app/departments/${item.id}`)}
                      className={`px-3 py-1.5 rounded-lg text-[0.8rem] font-medium transition-all duration-200 ${
                        index === department.path.length - 1
                          ? 'bg-violet-50 text-violet-700 border border-violet-200 shadow-sm'
                          : 'bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                      }`}
                    >
                      <span className="flex items-center gap-1.5">
                        <Building2 className="w-3 h-3" strokeWidth={2} />
                        {item.name}
                      </span>
                    </motion.button>
                    {index !== department.path.length - 1 && (
                      <ChevronRight className="w-4 h-4 text-gray-300 flex-shrink-0" strokeWidth={2} />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* STATS */}
        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <StatCard
              icon={<Users className="w-5 h-5" strokeWidth={1.75} />}
              label="Total Members"
              value={department.member_count ?? 0}
              gradient="from-blue-500 to-blue-600"
              bgGradient="from-blue-50 to-blue-100/30"
              borderColor="border-blue-200/60"
              iconBg="bg-blue-100"
              iconColor="text-blue-600"
              delay={0}
            />
            <StatCard
              icon={<GitBranch className="w-5 h-5" strokeWidth={1.75} />}
              label="Child Departments"
              value={department.children_count ?? 0}
              gradient="from-violet-500 to-violet-600"
              bgGradient="from-violet-50 to-violet-100/30"
              borderColor="border-violet-200/60"
              iconBg="bg-violet-100"
              iconColor="text-violet-600"
              delay={1}
            />
            <StatCard
              icon={<Crown className="w-5 h-5" strokeWidth={1.75} />}
              label="Department Head"
              value={department.head?.name || "Not Assigned"}
              gradient="from-amber-500 to-amber-600"
              bgGradient="from-amber-50 to-amber-100/30"
              borderColor="border-amber-200/60"
              iconBg="bg-amber-100"
              iconColor="text-amber-600"
              delay={2}
              isText
            />
          </div>
        </motion.div>

        {/* OVERVIEW */}
        <motion.div variants={itemVariants}>
          <div className="bg-white rounded-2xl border border-gray-100/80 shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
            <div className="px-5 sm:px-6 py-4 sm:py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200/50 border border-slate-200/60 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-slate-500" strokeWidth={1.75} />
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                    Department Overview
                  </h2>
                  <p className="text-[0.75rem] text-gray-400 mt-0.5">
                    Description and organizational context
                  </p>
                </div>
              </div>
            </div>
            <div className="px-5 sm:px-6 py-4 sm:py-5">
              <p className="text-sm sm:text-[0.9rem] text-gray-600 leading-relaxed max-w-3xl">
                {department.description || (
                  <span className="text-gray-400 italic">No department description available. Add a description to help team members understand the department's purpose and responsibilities.</span>
                )}
              </p>
            </div>
          </div>
        </motion.div>

        {/* MEMBERS SECTION */}
        <motion.div variants={itemVariants}>
          <DepartmentMembersSection
            members={department.members || []}
            loading={isFetching || updatingDepartment || removingMember || transferringMember}
            onAssign={() => setShowAssignModal(true)}
            onRemove={handleRemoveMember}
            onMakeHead={handleMakeHead}
            onTransfer={handleTransfer}
          />
        </motion.div>
      </motion.div>

      {/* MODALS */}
      <AssignMembersModal
        open={showAssignModal}
        onClose={() => setShowAssignModal(false)}
        department={department}
      />

      <TransferMemberModal
        open={showTransferModal}
        onClose={() => {
          setShowTransferModal(false);
          setSelectedMember(null);
        }}
        member={selectedMember}
        currentDepartmentId={department.id}
        onTransfer={handleTransferSubmit}
      />

      <DepartmentFormModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        department={department}
        onSuccess={() => {}}
      />
    </div>
  );
}

// =====================================================
// PREMIUM STAT CARD
// =====================================================
function StatCard({ icon, label, value, gradient, bgGradient, borderColor, iconBg, iconColor, delay, isText }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.2 + delay * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3, scale: 1.02, transition: { type: "spring", stiffness: 400, damping: 25 } }}
      className={`group relative bg-white rounded-2xl border ${borderColor} p-4 sm:p-5 shadow-sm hover:shadow-lg transition-all duration-300 ease-out cursor-default overflow-hidden`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`absolute top-0 left-4 right-4 h-[2px] bg-gradient-to-r ${gradient} rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

      <div className="relative flex items-center gap-3 sm:gap-4">
        <div className={`flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <span className={iconColor}>{icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[0.7rem] sm:text-xs text-gray-400 font-semibold uppercase tracking-wider">
            {label}
          </p>
          <p className={`text-lg sm:text-xl font-bold text-gray-900 tabular-nums tracking-tight mt-0.5 ${isText ? 'truncate' : ''}`}>
            {value}
          </p>
        </div>
      </div>
    </motion.div>
  );
}

// =====================================================
// LOADING SKELETON
// =====================================================
function DetailPageSkeleton() {
  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-6 sm:py-8 lg:py-10 space-y-6 sm:space-y-8">
        {/* Header skeleton */}
        <div className="animate-pulse">
          <div className="h-3 bg-gray-200 rounded w-32 mb-4" />
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gray-200" />
            <div className="space-y-2 pt-1">
              <div className="h-8 bg-gray-200 rounded w-48" />
              <div className="h-4 bg-gray-200 rounded w-64" />
            </div>
          </div>
        </div>
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-gray-200" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-20" />
                  <div className="h-6 bg-gray-200 rounded w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>
        {/* Overview skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-40 mb-4" />
          <div className="h-4 bg-gray-200 rounded w-full mb-2" />
          <div className="h-4 bg-gray-200 rounded w-3/4" />
        </div>
        {/* Members skeleton */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
          <div className="h-5 bg-gray-200 rounded w-48 mb-6" />
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 py-4 border-b border-gray-50">
              <div className="w-12 h-12 rounded-full bg-gray-200" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-gray-200 rounded w-32" />
                <div className="h-3 bg-gray-200 rounded w-48" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// =====================================================
// NOT FOUND STATE
// =====================================================
function NotFoundState({ onBack }) {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="text-center"
      >
        <div className="relative mb-6 mx-auto w-20 h-20">
          <div className="absolute inset-0 bg-gray-500/10 rounded-3xl blur-2xl scale-150" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center shadow-xl">
            <Building2 className="w-10 h-10 text-white" strokeWidth={1.5} />
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Department not found
        </h2>
        <p className="text-sm text-gray-500 mb-6 max-w-sm">
          The department you're looking for doesn't exist or has been removed.
        </p>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={onBack}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg shadow-violet-500/25 transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </motion.button>
      </motion.div>
    </div>
  );
}