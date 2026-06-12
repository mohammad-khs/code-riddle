"use client";

import { useState } from "react";

type UploadKey = "mainMusic" | "prizeMusic" | "backgroundImage";

const labels: Record<UploadKey, string> = {
  mainMusic: "Main Music",
  prizeMusic: "Prize Music",
  backgroundImage: "Background Image",
};

interface MediaSelectorDropdownProps {
  selected: UploadKey[];
  onToggle: (key: UploadKey) => void;
}

export default function MediaSelectorDropdown({
  selected,
  onToggle,
}: MediaSelectorDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);

  const options: UploadKey[] = ["mainMusic", "prizeMusic", "backgroundImage"];

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-slate-300 mb-1.5">
        Select Media Uploads (Optional)
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 flex justify-between items-center hover:border-slate-600 transition"
      >
        <span className="text-slate-300">
          {selected.length === 0
            ? "None selected"
            : `${selected.length} item${selected.length > 1 ? "s" : ""} selected`}
        </span>
        <svg
          className={`w-5 h-5 text-slate-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isOpen && (
        <div className="absolute z-10 mt-2 w-full rounded-xl border border-slate-700 bg-slate-900/80 shadow-xl overflow-hidden">
          {options.map((key) => (
            <div
              key={key}
              onClick={() => onToggle(key)}
              className="px-4 py-3 text-sm cursor-pointer hover:bg-slate-800 flex items-center justify-between transition"
            >
              <span className="text-slate-300">{labels[key]}</span>
              {selected.includes(key) && (
                <span className="text-sky-400 font-bold">✔</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
