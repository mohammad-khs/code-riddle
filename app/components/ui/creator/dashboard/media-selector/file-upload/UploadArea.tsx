import { FC } from "react";
import { X } from "lucide-react";

interface UploadAreaProps {
  file: File | null;
  loading: boolean;
  dragging: boolean;
  UploadIcon: React.ElementType;
  onUploadClick: () => void;
  onRemove: () => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragLeave: () => void;
}

export const UploadArea: FC<UploadAreaProps> = ({
  file,
  loading,
  UploadIcon,
  onUploadClick,
  onRemove,
  onDrop,
  onDragOver,
  onDragLeave,
}) => {
  return (
    <div onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={loading}
          onClick={onUploadClick}
          className={`
            inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold
            transition-all duration-200
            ${
              loading
                ? "cursor-not-allowed bg-slate-200 text-slate-400 dark:bg-slate-800"
                : "bg-sky-100 text-sky-700 hover:bg-sky-200 active:scale-95 dark:bg-sky-900/40 dark:text-sky-400"
            }
          `}
          aria-label={
            loading ? "Processing upload" : file ? "Change file" : "Upload file"
          }
        >
          <UploadIcon size={18} className={loading ? "animate-pulse" : ""} />
          {loading ? "Processing..." : file ? "Change file" : "Upload file"}
        </button>

        {file && (
          <div className="flex items-center gap-2 max-w-full rounded-lg bg-white dark:bg-slate-800 px-3 py-2 text-sm">
            <span className="max-w-[200px] truncate text-slate-700 dark:text-slate-200">
              {file.name}
            </span>
            <button
              type="button"
              onClick={onRemove}
              className="text-slate-400 hover:text-red-500 transition"
              aria-label="Remove file"
            >
              <X size={18} />
            </button>
          </div>
        )}
      </div>

      {!file && !loading && (
        <p className="mt-3 text-xs text-slate-400">
          Drag & drop or click to upload
        </p>
      )}
    </div>
  );
};
