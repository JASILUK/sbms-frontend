import { memo, useCallback, useRef } from "react";
import { Users, ArrowLeft, Check, Loader2, Camera, Type, AlignLeft, X, ImagePlus } from "lucide-react";

const GroupDetailsForm = memo(function GroupDetailsForm({
  form,
  onChange,
  selectedCount,
  isSubmitting,
  onSubmit,
  onBack,
  getAvatarColor,
}) {
  const fileInputRef = useRef(null);

  const handleChange = useCallback((field, value) => {
    onChange((prev) => ({ ...prev, [field]: value }));
  }, [onChange]);

  const handleFileSelect = useCallback((e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate image type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image must be less than 5MB");
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      onChange((prev) => ({
        ...prev,
        avatarFile: file,
        avatarPreview: reader.result,
      }));
    };
    reader.readAsDataURL(file);
  }, [onChange]);

  const handleRemoveAvatar = useCallback(() => {
    onChange((prev) => ({
      ...prev,
      avatarFile: null,
      avatarPreview: "",
    }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [onChange]);

  const triggerFileInput = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const isValid = form.name.trim().length > 0 && selectedCount > 0;

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Selected members summary */}
      <div className="px-4 pt-3 pb-2 flex-shrink-0">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-gray-400" />
          <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">
            {selectedCount} member{selectedCount !== 1 ? "s" : ""} selected
          </span>
        </div>
      </div>

      {/* Form — scrollable area */}
      <div className="flex-1 overflow-y-auto min-h-0 px-4 pb-4 space-y-4">
        
        {/* Avatar Upload */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-gray-700">Group Avatar</label>
          
          <div className="flex items-center gap-4">
            {/* Preview / Placeholder */}
            <div className="relative flex-shrink-0">
              {form.avatarPreview ? (
                <div className="relative group">
                  <img
                    src={form.avatarPreview}
                    alt="Group avatar preview"
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-gray-200 shadow-sm"
                  />
                  <button
                    onClick={handleRemoveAvatar}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center shadow-md hover:bg-rose-600 transition-colors"
                    title="Remove avatar"
                  >
                    <X className="w-3 h-3" strokeWidth={3} />
                  </button>
                </div>
              ) : (
                <div
                  onClick={triggerFileInput}
                  className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all group"
                >
                  <ImagePlus className="w-6 h-6 text-gray-400 group-hover:text-blue-500 transition-colors" />
                </div>
              )}
            </div>

            {/* Upload Controls */}
            <div className="flex-1 min-w-0 space-y-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
              />
              <button
                onClick={triggerFileInput}
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-xs font-medium text-gray-700 transition-colors"
              >
                <Camera className="w-3.5 h-3.5" />
                {form.avatarPreview ? "Change photo" : "Upload photo"}
              </button>
              <p className="text-[10px] text-gray-400">
                JPG, PNG, GIF up to 5MB
              </p>
            </div>
          </div>
        </div>

        {/* Group Name */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <Type className="w-3.5 h-3.5 text-gray-400" />
            Group Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => handleChange("name", e.target.value)}
            placeholder="e.g. Engineering Team"
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-gray-400"
            maxLength={100}
            autoFocus
          />
          <div className="flex justify-between">
            <span className="text-[10px] text-gray-400">Required</span>
            <span className="text-[10px] text-gray-400">{form.name.length}/100</span>
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-700">
            <AlignLeft className="w-3.5 h-3.5 text-gray-400" />
            Description
          </label>
          <textarea
            value={form.description}
            onChange={(e) => handleChange("description", e.target.value)}
            placeholder="What's this group about?"
            rows={3}
            maxLength={500}
            className="w-full px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-none placeholder:text-gray-400"
          />
          <div className="flex justify-between">
            <span className="text-[10px] text-gray-400">Optional</span>
            <span className="text-[10px] text-gray-400">{form.description.length}/500</span>
          </div>
        </div>
      </div>

      {/* Action Buttons — always visible at bottom */}
      <div className="border-t border-gray-100 bg-gray-50/50 p-3 flex gap-2 flex-shrink-0">
        <button
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-50 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={onSubmit}
          disabled={!isValid || isSubmitting}
          className="flex-[2] flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100 bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md hover:shadow-lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Creating...
            </>
          ) : (
            <>
              <Check className="w-4 h-4" />
              Create Group
            </>
          )}
        </button>
      </div>
    </div>
  );
});

export default GroupDetailsForm;