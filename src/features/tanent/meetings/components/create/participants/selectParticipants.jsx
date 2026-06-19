import { X } from "lucide-react";

export default function SelectedParticipants({
  participants,
  onRemove,
}) {
  if (!participants?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {participants.map((participant) => (
        <div
          key={participant.id}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-gray-50"
        >
          <div>
            <p className="text-sm font-medium">
              {participant.username}
            </p>

            <p className="text-xs text-gray-500">
              {participant.department_name}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onRemove(participant.id)
            }
            className="text-gray-400 hover:text-red-500"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}