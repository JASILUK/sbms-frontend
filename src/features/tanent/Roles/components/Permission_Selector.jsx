// features/roles/components/PermissionSelector.jsx
import { motion } from "framer-motion";
import { Check, ChevronDown, Shield, Info } from "lucide-react";
import { useState } from "react";

export default function PermissionSelector({
  groups,
  selectedIds,
  onToggle,
  onToggleGroup,
  disabled = false,
}) {
  const [expandedCategories, setExpandedCategories] = useState(
    new Set(groups.map((g) => g.category))
  );

  const toggleCategory = (category) => {
    const newSet = new Set(expandedCategories);
    if (newSet.has(category)) {
      newSet.delete(category);
    } else {
      newSet.add(category);
    }
    setExpandedCategories(newSet);
  };

  const isGroupSelected = (permissions) => {
    const ids = permissions.map((p) => p.id);
    return ids.every((id) => selectedIds.includes(id));
  };

  const isGroupPartial = (permissions) => {
    const ids = permissions.map((p) => p.id);
    const selected = ids.filter((id) => selectedIds.includes(id));
    return selected.length > 0 && selected.length < ids.length;
  };

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const isExpanded = expandedCategories.has(group.category);
        const allSelected = isGroupSelected(group.permissions);
        const isPartial = isGroupPartial(group.permissions);

        return (
          <motion.div
            key={group.category}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="border border-gray-200 rounded-xl overflow-hidden bg-white"
          >
            {/* Category Header */}
            <div
              className="flex items-center justify-between px-4 py-3 bg-gray-50/50 hover:bg-gray-50 transition-colors cursor-pointer"
              onClick={() => toggleCategory(group.category)}
            >
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleGroup(group.category, !allSelected);
                  }}
                  disabled={disabled}
                  className={`
                    flex items-center justify-center w-5 h-5 rounded border transition-all duration-200
                    ${allSelected 
                      ? "bg-violet-600 border-violet-600 text-white" 
                      : isPartial
                      ? "bg-violet-100 border-violet-400 text-violet-600"
                      : "border-gray-300 hover:border-violet-400"
                    }
                    ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {allSelected && <Check className="w-3.5 h-3.5" />}
                  {isPartial && <div className="w-2 h-2 bg-violet-600 rounded-sm" />}
                </button>
                
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-gray-500" />
                  <span className="font-semibold text-sm text-gray-900">
                    {group.category}
                  </span>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                    {group.permissions.length}
                  </span>
                </div>
              </div>

              <motion.div
                animate={{ rotate: isExpanded ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </motion.div>
            </div>

            {/* Permissions Grid */}
            <motion.div
              initial={false}
              animate={{ 
                height: isExpanded ? "auto" : 0,
                opacity: isExpanded ? 1 : 0 
              }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                {group.permissions.map((permission) => {
                  const isSelected = selectedIds.includes(permission.id);
                  
                  return (
                    <motion.label
                      key={permission.id}
                      whileHover={!disabled ? { scale: 1.01 } : {}}
                      whileTap={!disabled ? { scale: 0.99 } : {}}
                      className={`
                        flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-all duration-200
                        ${isSelected 
                          ? "border-violet-200 bg-violet-50/50" 
                          : "border-gray-200 hover:border-violet-200 hover:bg-gray-50"
                        }
                        ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                      `}
                    >
                      <div className="relative flex items-center mt-0.5">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => onToggle(permission.id)}
                          disabled={disabled}
                          className="peer sr-only"
                        />
                        <div className={`
                          w-4 h-4 rounded border-2 transition-all duration-200
                          ${isSelected 
                            ? "bg-violet-600 border-violet-600" 
                            : "border-gray-300 peer-hover:border-violet-400"
                          }
                        `}>
                          {isSelected && (
                            <Check className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                          )}
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {permission.name}
                        </p>
                        {permission.description && (
                          <div className="group/tooltip relative mt-1 inline-block">
                            <Info className="w-3.5 h-3.5 text-gray-400 cursor-help" />
                            <div className="absolute bottom-full left-0 mb-2 hidden group-hover/tooltip:block z-50 w-64">
                              <div className="bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-xl">
                                {permission.description}
                                <div className="absolute top-full left-4 -mt-1 border-4 border-transparent border-t-gray-900" />
                              </div>
                            </div>
                          </div>
                        )}
                        <p className="text-xs text-gray-500 font-mono mt-0.5">
                          {permission.code}
                        </p>
                      </div>
                    </motion.label>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
}