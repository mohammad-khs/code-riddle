import { FC } from "react";
import { X } from "lucide-react";
import { Button } from "@/app/components/ui/button";

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
        <Button
          type="button"
          variant="upload"
          disabled={loading}
          onClick={onUploadClick}
          className="gap-2"
          aria-label={
            loading ? "Processing upload" : file ? "Change file" : "Upload file"
          }
        >
          <UploadIcon size={18}/>
          {loading ? "Processing..." : file ? "Change file" : "Upload file"}
        </Button>

        {file && (
          <div className="flex items-center gap-2 max-w-full rounded-xl bg-slate-800/60 px-3 py-2 text-sm">
            <span className="max-w-[200px] truncate text-slate-300">
              {file.name}
            </span>
            <Button
              type="button"
              variant={"icon"}
              size={"sm"}
              onClick={onRemove}
              className="text-slate-400 hover:text-red-500 transition"
              aria-label="Remove file"
            >
              <X size={18} />
            </Button>
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
