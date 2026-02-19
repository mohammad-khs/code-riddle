"use client";

import { Button } from "../../button";

interface SaveButtonProps {
  onSave: () => void;
  message: string;
  isSaving?: boolean;
}

export default function SaveButton({ onSave, message }: SaveButtonProps) {
  return (
    <div>
      <Button
        onClick={onSave}
        disabled={message === "Saving..."}
        variant={"default"}
      >
        Save All
      </Button>
      {message && (
        <div className="mt-2 text-slate-700 dark:text-slate-200">{message}</div>
      )}
    </div>
  );
}