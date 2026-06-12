import Image from "next/image";
import { FC } from "react";

interface FilePreviewProps {
  file: File;
  previewUrl: string;
}

export const FilePreview: FC<FilePreviewProps> = ({
  file,
  previewUrl,
}) => {
  return (
    <div className="mt-4">
      {file.type.startsWith("image/") && (
        <Image
          src={previewUrl}
          alt="Preview"
          width={400}
          height={300}
          className="max-h-48 w-full rounded-xl object-contain border border-slate-700"
        />
      )}

      {file.type.startsWith("audio/") && (
        <audio
          controls
          className="w-full mt-2 rounded-xl"
        >
          <source src={previewUrl} />
          Your browser does not support the audio element.
        </audio>
      )}
    </div>
  );
};
