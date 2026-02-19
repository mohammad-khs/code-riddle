import { PauseIcon, PlayIcon } from "lucide-react";

interface MusicControlButtonProps {
  isPlaying: boolean;
  onToggle: () => void;
  label: string;
}

export default function MusicControlButton({
  isPlaying,
  onToggle,
  label,
}: MusicControlButtonProps) {
  return (
    <div
      className={`fixed right-3 bottom-16 z-50 hover:opacity-100 ${isPlaying ? "opacity-50" : "opacity-90"} transition-opacity`}
    >
      <button
        onClick={onToggle}
        className="flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 shadow"
      >
        <span className="sr-only">{label}</span>
        {isPlaying ? (
          <PauseIcon className="h-6 w-6 text-slate-900 dark:text-slate-100" />
        ) : (
          <PlayIcon className="h-6 w-6 text-slate-900 dark:text-slate-100" />
        )}
      </button>
    </div>
  );
}
