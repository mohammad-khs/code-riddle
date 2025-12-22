"use client";

import { FC, useEffect, useMemo, useRef, useState } from "react";
import { Upload, Image as ImageIcon, Music } from "lucide-react";
import { useFileUpload } from "./useFileUpload";
import { UploadArea } from "./UploadArea";
import { FilePreview } from "./FilePreview";

interface FileUploadFieldProps {
  label: string;
  accept: string;
  file: File | null;
  maxSizeMB?: number;
  onChange: (file: File | null) => void;
}

const FileUploadField: FC<FileUploadFieldProps> = ({
  label,
  accept,
  file,
  maxSizeMB = 10,
  onChange,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);

  const { error, validateAndSetFile, reset } = useFileUpload({
    accept,
    maxSizeMB,
    onChange,
  });

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  const UploadIcon = useMemo(() => {
    if (!file) return Upload;
    if (file.type.startsWith("image/")) return ImageIcon;
    if (file.type.startsWith("audio/")) return Music;
    return Upload;
  }, [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    setLoading(true);
    validateAndSetFile(e.dataTransfer.files?.[0] || null);
    setLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    validateAndSetFile(e.target.files?.[0] || null);
    setLoading(false);
  };

  return (
    <div
      className={`rounded-xl border-2 border-dashed p-4 transition ${
        dragging
          ? "border-sky-400 bg-sky-50 dark:bg-sky-900/20"
          : "border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/40"
      }`}
    >
      <label className="block mb-2 text-sm font-medium">{label}</label>

      <input
        title="upload-input"
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleInputChange}
        className="hidden"
        disabled={loading}
      />

      <UploadArea
        file={file}
        loading={loading}
        dragging={dragging}
        UploadIcon={UploadIcon}
        onUploadClick={() => inputRef.current?.click()}
        onRemove={reset}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
      />

      {file && previewUrl && (
        <FilePreview file={file} previewUrl={previewUrl} />
      )}
      {error && <p className="mt-2 text-xs text-red-500">⚠ {error}</p>}
    </div>
  );
};

export default FileUploadField;
