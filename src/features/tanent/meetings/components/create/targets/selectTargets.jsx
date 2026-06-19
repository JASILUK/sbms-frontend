import { X } from "lucide-react";

export default function SelectedTargets({
  targets,
  onRemove,
}) {
  if (!targets?.length) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {targets.map((target) => (
        <div
          key={target.target_id}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border bg-gray-50"
        >
          <div>
            <p className="text-sm font-medium">
              {target.name}
            </p>

            <p className="text-xs text-gray-500">
              {target.target_type}
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              onRemove(target.target_id)
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