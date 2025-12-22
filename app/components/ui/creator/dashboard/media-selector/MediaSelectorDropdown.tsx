"use client";

import { useState } from "react";

type UploadKey = "mainMusic" | "prizeMusic" | "backgroundImage";

const labels: Record<UploadKey, string> = {
  mainMusic: "Main Music",
  prizeMusic: "Prize Music",
  backgroundImage: "Background Music",
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
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
        Select media uploads (optional)
      </label>

      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 flex justify-between items-center hover:border-slate-400 dark:hover:border-slate-500 transition"
      >
        <span className="text-slate-700 dark:text-slate-300">
          {selected.length === 0
            ? "None selected"
            : `${selected.length} Selected item`}
        </span>
        <svg
          className={`w-5 h-5 text-slate-500 transition-transform ${
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
        <div className="absolute z-10 mt-2 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
          {options.map((key) => (
            <div
              key={key}
              onClick={() => onToggle(key)}
              className="px-4 py-3 text-sm cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center justify-between transition"
            >
              <span>{labels[key]}</span>
              {selected.includes(key) && (
                <span className="text-sky-500 font-bold">✔</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
