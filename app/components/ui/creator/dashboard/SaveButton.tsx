import { Button } from "../../button";

interface SaveButtonProps {
  onSave: () => void;
  message: string;
  isSaving?: boolean;
}

export default function SaveButton({ onSave, message }: SaveButtonProps) {
  const isSaving = message === "Saving...";

  return (
    <div className="flex items-center gap-4">
      <Button
        onClick={onSave}
        disabled={isSaving}
      >
        Save All
      </Button>
      {message && (
        <span className={`text-sm font-medium ${
          isSaving ? "text-blue-300" : "text-emerald-400"
        }`}>
          {message}
        </span>
      )}
    </div>
  );
}