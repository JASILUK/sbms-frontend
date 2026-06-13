// components/InviteEmployeeModal.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Mail, 
  Plus, 
  Trash2, 
  Upload, 
  FileSpreadsheet, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Users,
  Shield,
  Building2,
  UserCheck
} from "lucide-react";
import {
  useInviteEmployeeMutation,
  useBulkInviteEmployeesMutation,
  useBulkInviteCSVMutation
} from "../emplyeeApi";
import { useEmployeeFormData } from "../useemployeeFormData";

function InviteRow({ row, index, roles, departments, onUpdate, onRemove, canRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.2 }}
      className="grid grid-cols-12 gap-3 items-start"
    >
      <div className="col-span-5">
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="email"
            placeholder="colleague@company.com"
            value={row.email}
            onChange={(e) => onUpdate(index, "email", e.target.value)}
            className="w-full pl-10 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>
      </div>
      
      <div className="col-span-3">
        <div className="relative">
          <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={row.role}
            onChange={(e) => onUpdate(index, "role", e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Role</option>
            {roles?.map(r => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <div className="col-span-3">
        <div className="relative">
          <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <select
            value={row.department}
            onChange={(e) => onUpdate(index, "department", e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all appearance-none cursor-pointer"
          >
            <option value="">Department</option>
            {departments?.map(d => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>
          <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
      
      <div className="col-span-1 flex justify-end">
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="p-2.5 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
            title="Remove row"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

function CSVUploadSection({ file, onFileChange, onUpload, isUploading }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      onFileChange(droppedFile);
    }
  };

  return (
    <div className="border-t border-gray-100 pt-6">
      <h3 className="text-sm font-medium text-gray-900 mb-3">Or upload CSV file</h3>
      
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all ${
          isDragging 
            ? "border-blue-500 bg-blue-50" 
            : file 
              ? "border-emerald-500 bg-emerald-50" 
              : "border-gray-200 hover:border-gray-300 bg-gray-50/50"
        }`}
      >
        <input
          type="file"
          accept=".csv"
          onChange={(e) => onFileChange(e.target.files[0])}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        
        {file ? (
          <div className="space-y-2">
            <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
            </div>
            <p className="font-medium text-gray-900">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onFileChange(null);
              }}
              className="text-sm text-rose-600 hover:text-rose-700 font-medium"
            >
              Remove file
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
              <Upload className="w-6 h-6 text-gray-400" />
            </div>
            <div>
              <p className="font-medium text-gray-900">Drop your CSV file here</p>
              <p className="text-sm text-gray-500 mt-1">or click to browse</p>
            </div>
            <p className="text-xs text-gray-400">Supports .csv files up to 5MB</p>
          </div>
        )}
      </div>

      {file && (
        <button
          type="button"
          onClick={onUpload}
          disabled={isUploading}
          className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isUploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Uploading...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              Upload and invite
            </>
          )}
        </button>
      )}
    </div>
  );
}

function ResultSummary({ result, onClose, inviteType }) {
  // Handle single invite response
  const isSingleInvite = inviteType === 'single';
  const isSuccess = result?.success;
  const message = result?.message || '';
  
  // Handle bulk invite response with data object
  const data = result?.data || {};
  const createdCount = isSingleInvite ? 1 : (data.created_count || 0);
  const failedCount = data.failed_count || 0;
  const failed = data.failed || [];

  // Determine if fully successful, partial, or failed
  const isFullySuccessful = isSuccess && failedCount === 0;
  const isPartial = isSuccess && failedCount > 0;
  const isFailed = !isSuccess;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-8 text-center"
    >
      {isFullySuccessful && (
        <>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <UserCheck className="w-8 h-8 text-emerald-600" />
          </motion.div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {isSingleInvite ? 'Invitation sent' : 'Invitations sent successfully'}
          </h3>
          <p className="text-gray-500 mb-6">
            {isSingleInvite 
              ? 'Team member will receive an email to join your workspace.'
              : `${createdCount} ${createdCount === 1 ? 'member' : 'members'} invited to your workspace.`
            }
          </p>
        </>
      )}

      {isPartial && (
        <>
          <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-amber-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Partially completed
          </h3>
          <p className="text-gray-500 mb-4">
            {createdCount} invited, {failedCount} failed
          </p>
          
          {failed.length > 0 && (
            <div className="text-left bg-gray-50 rounded-lg p-4 mb-6 max-h-48 overflow-y-auto">
              <p className="text-sm font-medium text-gray-700 mb-2">Failed invites:</p>
              <ul className="space-y-2">
                {failed.map((item, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <span className="text-rose-500 mt-1.5">•</span>
                    <div>
                      <span className="font-medium">{item.email}</span>
                      <span className="text-gray-400 mx-2">—</span>
                      <span className="text-rose-600">{item.error || 'Unknown error'}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}

      {isFailed && (
        <>
          <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-rose-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Failed to send invites
          </h3>
          <p className="text-gray-500 mb-6">
            {message || 'Something went wrong. Please try again.'}
          </p>
        </>
      )}
      
      <button
        onClick={onClose}
        className="px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
      >
        Done
      </button>
    </motion.div>
  );
}

export default function InviteEmployeeModal({ close }) {
  const { roles, departments } = useEmployeeFormData();
  
  const [rows, setRows] = useState([{ email: "", role: "", department: "" }]);
  const [file, setFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [inviteType, setInviteType] = useState(null); // 'single' or 'bulk'
  const [error, setError] = useState(null);

  const [inviteEmployee] = useInviteEmployeeMutation();
  const [bulkInvite] = useBulkInviteEmployeesMutation();
  const [uploadCSV] = useBulkInviteCSVMutation();

  const updateRow = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { email: "", role: "", department: "" }]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const validRows = rows.filter(r => r.email.trim() !== "");

  const submit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      let response;
      
      if (validRows.length === 1) {
        setInviteType('single');
        response = await inviteEmployee({
          email: validRows[0].email,
          role: validRows[0].role,
          department: validRows[0].department || null
        }).unwrap();
      } else {
        setInviteType('bulk');
        response = await bulkInvite({
          invites: validRows.map(r => ({
            email: r.email,
            role: r.role,
            department: r.department || null
          }))
        }).unwrap();
      }

      setResult(response);
    } catch (err) {
      setError(err?.data?.message || "Failed to send invites. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const uploadCSVFile = async () => {
    if (!file) return;
    
    setIsSubmitting(true);
    setError(null);
    setInviteType('bulk');

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await uploadCSV(formData).unwrap();
      setResult(response);
      setFile(null);
    } catch (err) {
      setError(err?.data?.message || "CSV upload failed. Please check your file format.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={close}
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 20 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {result ? (
          <ResultSummary result={result} inviteType={inviteType} onClose={close} />
        ) : (
          <>
            {/* Header */}
            <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Invite team members</h2>
                  <p className="text-sm text-gray-500">Send invitations to join your workspace.</p>
                </div>
              </div>
              <button
                onClick={close}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6 space-y-6">
                {/* Error Message */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="p-4 bg-rose-50 border border-rose-100 rounded-lg flex items-start gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-rose-700">{error}</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Invite Form */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-gray-900">Invite by email</h3>
                    <span className="text-xs text-gray-500">
                      {validRows.length} of {rows.length} ready to invite
                    </span>
                  </div>
                  
                  <div className="bg-gray-50/50 rounded-xl p-4 space-y-3">
                    <AnimatePresence mode="popLayout">
                      {rows.map((row, index) => (
                        <InviteRow
                          key={index}
                          row={row}
                          index={index}
                          roles={roles}
                          departments={departments}
                          onUpdate={updateRow}
                          onRemove={removeRow}
                          canRemove={rows.length > 1}
                        />
                      ))}
                    </AnimatePresence>
                    
                    <motion.button
                      type="button"
                      onClick={addRow}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="w-full flex items-center justify-center gap-2 py-3 border-2 border-dashed border-gray-200 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add another member
                    </motion.button>
                  </div>
                </div>

                {/* CSV Upload */}
                <CSVUploadSection
                  file={file}
                  onFileChange={setFile}
                  onUpload={uploadCSVFile}
                  isUploading={isSubmitting && file}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between flex-shrink-0">
              <button
                type="button"
                onClick={close}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={submit}
                disabled={isSubmitting || validRows.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-900 text-white text-sm font-medium rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Sending invites...
                  </>
                ) : (
                  <>
                    Send {validRows.length > 0 && `(${validRows.length})`} invites
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}