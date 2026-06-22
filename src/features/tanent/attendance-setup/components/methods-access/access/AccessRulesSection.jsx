import React, { useState } from 'react';
import { toast } from 'sonner';
import { Layers, Plus } from 'lucide-react';

import { 
  useCreateAccessRuleProfileMutation, 
  useUpdateAccessRuleProfileMutation,
  useDeleteAccessRuleProfileMutation 
} from '../../../api/attendanceAccessApi';
import { formatAxiosErrorContext } from '../../../utils/accessHelpers';
import { RuleCard } from './RuleCard';
import { RuleModal } from './RuleModal';

export function AccessRulesSection({ accessRules, departmentsPool, companyMethodsPool, companyLocationsPool, locationMap }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRuleToEdit, setSelectedRuleToEdit] = useState(null);

  const [createRuleProfile] = useCreateAccessRuleProfileMutation();
  const [updateRuleProfile] = useUpdateAccessRuleProfileMutation();
  const [deleteRuleProfile] = useDeleteAccessRuleProfileMutation();

  const handleOpenCreationModal = () => {
    setSelectedRuleToEdit(null); // Explicitly reset to null to state freshness
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (ruleInstance) => {
    // Flatten incoming nested shapes down into pure arrays matching form requirements
    const flattenedMethods = Array.isArray(ruleInstance.allowed_methods)
      ? ruleInstance.allowed_methods.map(m => typeof m === 'object' ? m.id : m)
      : [];
    const flattenedLocations = Array.isArray(ruleInstance.allowed_locations)
      ? ruleInstance.allowed_locations.map(l => typeof l === 'object' ? l.id : l)
      : [];
    const departmentId = typeof ruleInstance.department === 'object' && ruleInstance.department !== null
      ? ruleInstance.department.id
      : ruleInstance.department;

    setSelectedRuleToEdit({
      ...ruleInstance,
      department: departmentId,
      allowed_methods: flattenedMethods,
      allowed_locations: flattenedLocations
    });
    setIsModalOpen(true);
  };

  const handleRuleSubmissionCommit = async (formData) => {
    try {
      if (selectedRuleToEdit?.id) {
        // ✅ Run PATCH update routine
        await updateRuleProfile({ id: selectedRuleToEdit.id, ...formData }).unwrap();
        toast.success('Custom scoped priority validation matrix updated successfully.');
      } else {
        // ✅ Run POST initialization creation routine
        await createRuleProfile(formData).unwrap();
        toast.success('Custom priority matrix configuration rule appended safely.');
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error(formatAxiosErrorContext(err));
    }
  };

  const handleConfirmRulePurge = async (ruleId) => {
    if (!window.confirm('Delete this scoped configuration strategy policy rule line item?')) return;
    try {
      await deleteRuleProfile(ruleId).unwrap();
      toast.success('Rule matching profile removed successfully from multi-tenant caching.');
    } catch (err) {
      toast.error(formatAxiosErrorContext(err));
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn text-xs">
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/60 shadow-3xs">
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 block flex items-center gap-1.5">
            <Layers className="h-4 w-4 text-slate-600" /> Custom Scoped Policy Profiles Layer
          </span>
          <p className="text-[11px] text-slate-400 font-normal">
            Rules evaluate sequentially following defined priorities rank weights index numbers parameters.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreationModal}
          className="inline-flex items-center justify-center px-3 py-1.5 text-white bg-slate-900 hover:bg-slate-800 active:scale-98 rounded-xl font-semibold gap-1.5 shadow-sm transition-all duration-200"
        >
          <Plus className="h-3.5 w-3.5" /> Establish Rule
        </button>
      </div>

      {accessRules.length === 0 ? (
        <div className="p-10 border border-dashed border-slate-200 text-center rounded-xl bg-slate-50/40 text-slate-400 italic font-semibold">
          No specialized conditional segment routing priority rules deployed yet. Fallbacks cascade to global defaults safely.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accessRules.map((rule) => (
            <RuleCard
              key={rule.id}
              rule={rule}
              locationMap={locationMap}
              onEditTrigger={handleOpenEditModal}
              onDeleteTrigger={handleConfirmRulePurge}
            />
          ))}
        </div>
      )}

      {isModalOpen && (
        <RuleModal
          initialValues={selectedRuleToEdit} // Modal forms will intercept this parameter cleanly
          departmentsPool={departmentsPool}
          companyMethodsPool={companyMethodsPool}
          companyLocationsPool={companyLocationsPool}
          onClose={() => setIsModalOpen(false)}
          onSave={handleRuleSubmissionCommit}
        />
      )}
    </div>
  );
}