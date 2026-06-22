import React, { useState } from 'react';
import { toast } from 'sonner';
import { UserCheck, UserPlus } from 'lucide-react';

import { 
  useCreateEmployeeOverrideProfileMutation, 
  useUpdateEmployeeOverrideProfileMutation, // ✅ Added hook mutation reference link
  useDeleteEmployeeOverrideProfileMutation 
} from '../../../api/attendanceAccessApi';
import { formatAxiosErrorContext } from '../../../utils/accessHelpers';
import { OverrideCard } from './OverrideCard';
import { OverrideModal } from './OverrideModal';

export function EmployeeOverridesSection({ employeeOverrides, employeesPool, companyMethodsPool, companyLocationsPool, employeeIndexMap }) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOverrideToEdit, setSelectedOverrideToEdit] = useState(null);

  const [createOverrideProfile] = useCreateEmployeeOverrideProfileMutation();
  const [updateOverrideProfile] = useUpdateEmployeeOverrideProfileMutation(); // ✅ Instantiate hook
  const [deleteOverrideProfile] = useDeleteEmployeeOverrideProfileMutation();

  const handleOpenCreationModal = () => {
    setSelectedOverrideToEdit(null);
    setIsOpen(true);
  };

  const handleOpenEditModal = (overrideInstance) => {
    // Flatten nested relation lists into scalar IDs matching React Hook Form expectations
    const flattenedMethods = Array.isArray(overrideInstance.allowed_methods)
      ? overrideInstance.allowed_methods.map(m => typeof m === 'object' ? m.id : m)
      : [];
    const flattenedLocations = Array.isArray(overrideInstance.allowed_locations)
      ? overrideInstance.allowed_locations.map(l => typeof l === 'object' ? l.id : l)
      : [];
    const membershipId = typeof overrideInstance.membership === 'object' && overrideInstance.membership !== null
      ? overrideInstance.membership.id
      : overrideInstance.membership;

    setSelectedOverrideToEdit({
      ...overrideInstance,
      membership_id: membershipId,
      allowed_methods: flattenedMethods,
      allowed_locations: flattenedLocations
    });
    setIsOpen(true);
  };

  const handleCreateOverrideSubmit = async (formData) => {
    try {
      if (selectedOverrideToEdit?.id) {
        // ✅ Run PATCH mutation update logic sequence
        await updateOverrideProfile({ id: selectedOverrideToEdit.id, ...formData }).unwrap();
        toast.success('Individual authorization exception baseline parameters updated successfully.');
      } else {
        // ✅ Run POST initialization creation logic sequence
        await createOverrideProfile(formData).unwrap();
        toast.success('Individual authorization exception baseline parameters recorded.');
      }
      setIsOpen(false);
    } catch (err) {
      toast.error(formatAxiosErrorContext(err));
    }
  };

  const handleEvictOverrideConfirm = async (overrideId) => {
    if (!window.confirm('Revoke individual compliance override context tracking parameters completely?')) return;
    try {
      await deleteOverrideProfile(overrideId).unwrap();
      toast.success('Variance target evicted from parameters tables registers.');
    } catch (err) {
      toast.error(formatAxiosErrorContext(err));
    }
  };

  return (
    <div className="space-y-4 animate-fadeIn text-xs">
      <div className="flex justify-between items-center bg-slate-50 p-3 rounded-xl border border-slate-200/60">
        <div className="space-y-0.5">
          <span className="font-bold text-slate-900 block flex items-center gap-1.5">
            <UserCheck className="h-4 w-4 text-slate-600" /> Individual Variance Exceptions Registry
          </span>
          <p className="text-[11px] text-slate-400 font-medium">
            Bypass structural scoped priority parameters by deploying isolated profile exemptions targets lines rows.
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenCreationModal}
          className="inline-flex items-center justify-center px-3 py-1.5 text-white bg-slate-900 hover:bg-slate-800 rounded-lg font-semibold gap-1.5 shadow-sm transition-colors"
        >
          <UserPlus className="h-3.5 w-3.5" /> Inject Override
        </button>
      </div>

      {employeeOverrides.length === 0 ? (
        <div className="p-10 border border-dashed border-slate-200 text-center rounded-xl bg-slate-50/40 text-slate-400 italic font-semibold">
          No active individual member compliance parameter exceptions records injected. Cascades follow rules layer metrics targets.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {employeeOverrides.map((override) => (
            <OverrideCard
              key={override.id}
              override={override}
              employeeRecord={employeeIndexMap.get(override.membership?.id || override.membership)}
              onEditTrigger={handleOpenEditModal} // ✅ Route edit event handler link
              onDeleteTrigger={handleEvictOverrideConfirm}
            />
          ))}
        </div>
      )}

      {isOpen && (
        <OverrideModal
          initialValues={selectedOverrideToEdit} // ✅ Pass form data initialization down into workspace context
          employeesPool={employeesPool}
          companyMethodsPool={companyMethodsPool}
          companyLocationsPool={companyLocationsPool}
          onClose={() => setIsOpen(false)}
          onSave={handleCreateOverrideSubmit}
        />
      )}
    </div>
  );
} 