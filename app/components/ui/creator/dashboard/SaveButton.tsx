"use client";

interface SaveButtonProps {
  onSave: () => void;
  message: string;
  isSaving?: boolean;
}

export default function SaveButton({ onSave, message }: SaveButtonProps) {
  return (
    <div>
      <button
        onClick={onSave}
        disabled={message === "Saving..."}
        className="bg-sky-500 hover:bg-sky-600 disabled:opacity-70 text-white px-4 py-2 rounded-md"
      >
        Save All
      </button>
      {message && (
        <div className="mt-2 text-slate-700 dark:text-slate-200">{message}</div>
      )}
    </div>
  );
}