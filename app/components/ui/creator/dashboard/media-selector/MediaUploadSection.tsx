"use client";

import { FC, useState } from "react";
import MediaSelectorDropdown from "./MediaSelectorDropdown";
import FileUploadField from "./file-upload/FileUploadField";

type UploadKey = "mainMusic" | "prizeMusic" | "backgroundImage";

interface MediaUploadSectionProps {
  mainMusicFile: File | null;
  musicFile: File | null;
  backgroundImageFile: File | null;
  onMainMusicChange: (file: File | null) => void;
  onPrizeMusicChange: (file: File | null) => void;
  onBackgroundImageChange: (file: File | null) => void;
}

const MediaUploadSection: FC<MediaUploadSectionProps> = (props) => {
  const [selected, setSelected] = useState<UploadKey[]>([]);

  const toggle = (key: UploadKey) => {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  };

  const uploadFields = [
    {
      key: "mainMusic" as UploadKey,
      label: "Main Music",
      accept: "audio/*",
      file: props.mainMusicFile,
      onChange: props.onMainMusicChange,
    },
    {
      key: "prizeMusic" as UploadKey,
      label: "Prize Music",
      accept: "audio/*",
      file: props.musicFile,
      onChange: props.onPrizeMusicChange,
    },
    {
      key: "backgroundImage" as UploadKey,
      label: "Background Image",
      accept: "image/*",
      file: props.backgroundImageFile,
      onChange: props.onBackgroundImageChange,
    },
  ];

  return (
    <div className="space-y-6">
      <MediaSelectorDropdown selected={selected} onToggle={toggle} />

      {uploadFields
        .filter((field) => selected.includes(field.key))
        .map((field) => (
          <FileUploadField
            key={field.key}
            label={field.label}
            accept={field.accept}
            file={field.file}
            onChange={field.onChange}
          />
        ))}
    </div>
  );
};

export default MediaUploadSection;
