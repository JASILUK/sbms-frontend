import { useState } from "react";

import TargetSelectorModal from "../targets/targetsSelectModal";
import SelectedTargets from "../targets/selectTargets";

export default function MeetingTargetsSection({
  targets,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const removeTarget = (targetId) => {
    onChange(
      targets.filter(
        (target) =>
          target.target_id !== targetId
      )
    );
  };

  return (
    <>
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Target Departments
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Select departments for targeted meetings
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
          >
            Add Targets
          </button>
        </div>

        <SelectedTargets
          targets={targets}
          onRemove={removeTarget}
        />
      </div>

      <TargetSelectorModal
        open={open}
        onClose={() => setOpen(false)}
        selectedTargets={targets}
        onChange={onChange}
      />
    </>
  );
}