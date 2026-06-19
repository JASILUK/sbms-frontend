export default function MeetingSubmitBar({
  isSubmitting,
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white z-30">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-end">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 rounded-xl bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
        >
          {isSubmitting
            ? "Creating..."
            : "Create Meeting"}
        </button>
      </div>
    </div>
  );
}