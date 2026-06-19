import { useMemo, useState } from "react";

import {
  X,
  Search,
  Building2,
  Loader2,
} from "lucide-react";

import { useGetDepartmentsQuery } from "../../../deaprtment/departmentApi";

export default function EditTargetModal({
  isOpen,
  onClose,
  target,
  onSubmit,
  isLoading = false,
}) {
  const [search, setSearch] =
    useState("");

  const {
    data,
    isLoading: isDepartmentsLoading,
  } = useGetDepartmentsQuery();

  const departments =
    data?.data || [];

  const filteredDepartments =
    useMemo(() => {
      return departments.filter(
        (department) =>
          department.name
            ?.toLowerCase()
            .includes(
              search.toLowerCase()
            )
      );
    }, [departments, search]);

  const handleSelect = async (
    department
  ) => {
    try {
      await onSubmit({
        targetId: target.id,

        data: {
          target_type:
            "department",

          target_id:
            department.id,
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  if (!isOpen || !target) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={
          isLoading
            ? undefined
            : onClose
        }
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">

          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Edit Target
              </h2>

              <p className="text-sm text-slate-500 mt-1">
                Replace target department
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-100">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value
                  )
                }
                placeholder="Search departments..."
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[420px] overflow-y-auto">
            {isDepartmentsLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
              </div>
            ) : (
              filteredDepartments.map(
                (department) => {
                  const isCurrent =
                    department.id ===
                    target.target_id;

                  return (
                    <div
                      key={department.id}
                      className="flex items-center justify-between px-5 py-4 border-b border-slate-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-emerald-600" />
                        </div>

                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            {
                              department.name
                            }
                          </p>

                          <p className="text-xs text-slate-500 mt-0.5">
                            {
                              department.member_count
                            }{" "}
                            members
                          </p>
                        </div>
                      </div>

                      {isCurrent ? (
                        <span className="text-xs font-medium text-indigo-600">
                          Current
                        </span>
                      ) : (
                        <button
                          type="button"
                          disabled={
                            isLoading
                          }
                          onClick={() =>
                            handleSelect(
                              department
                            )
                          }
                          className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
                        >
                          Select
                        </button>
                      )}
                    </div>
                  );
                }
              )
            )}
          </div>
        </div>
      </div>
    </>
  );
}