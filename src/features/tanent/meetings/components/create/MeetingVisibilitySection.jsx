import { useFormContext } from "react-hook-form";

export default function MeetingVisibilitySection() {
  const { register } = useFormContext();

  return (
    <div className="bg-white border rounded-2xl p-6 space-y-4">
      <div>
        <h2 className="text-base font-semibold">
          Visibility
        </h2>

        <p className="text-sm text-gray-500 mt-1">
          Control meeting access
        </p>
      </div>

      <div>
        <label className="text-sm font-medium">
          Visibility Type
        </label>

        <select
          {...register("visibility")}
          className="w-full mt-1 border rounded-lg px-3 py-2 text-sm"
        >
          <option value="public">
            Public
          </option>

          <option value="organization">
            Organization
          </option>

          <option value="private">
            Private
          </option>

          <option value="targeted">
            Targeted
          </option>
        </select>
      </div>
    </div>
  );
}