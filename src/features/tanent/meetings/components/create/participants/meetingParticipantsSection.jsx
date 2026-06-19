import { useState } from "react";

import ParticipantSelectorModal from "./partcipantsSelectModal";
import SelectedParticipants from "./selectParticipants";

export default function MeetingParticipantsSection({
  participants,
  onChange,
}) {
  const [open, setOpen] = useState(false);

  const removeParticipant = (id) => {
    onChange(
      participants.filter(
        (participant) =>
          participant.id !== id
      )
    );
  };

  return (
    <>
      <div className="bg-white border rounded-2xl p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-base font-semibold text-gray-900">
              Participants
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Select private meeting participants
            </p>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="px-4 py-2 rounded-lg border text-sm font-medium hover:bg-gray-50"
          >
            Add Participants
          </button>
        </div>

        <SelectedParticipants
          participants={participants}
          onRemove={removeParticipant}
        />
      </div>

      <ParticipantSelectorModal
        open={open}
        onClose={() => setOpen(false)}
        selectedParticipants={participants}
        onChange={onChange}
      />
    </>
  );
}