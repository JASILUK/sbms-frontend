import { useFormContext } from "react-hook-form";

export default function MeetingOptionsSection() {
  const { register } = useFormContext();

  return (
    <div className="bg-white border rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-base font-semibold">
          Meeting Options
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Configure meeting settings
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">
          Max Participants
        </label>

        <input
          type="number"
          {...register(
            "max_participants"
          )}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
          placeholder="Optional"
        />
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register(
            "waiting_room_enabled"
          )}
        />

        <label className="text-sm">
          Enable waiting room
        </label>
      </div>

      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          {...register(
            "recording_enabled"
          )}
        />

        <label className="text-sm">
          Enable recording
        </label>
      </div>
    </div>
  );
}