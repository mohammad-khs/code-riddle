import { FC } from "react";

interface PrizeInputProps {
  prizeLetter: string;
  onUpdate: (value: string) => void;
}

const PrizeInput: FC<PrizeInputProps> = ({ prizeLetter, onUpdate }) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-1.5">
        Prize Letter
      </label>
      <textarea
        title="Prize Letter"
        value={prizeLetter}
        onChange={(e) => onUpdate(e.target.value)}
        className="mt-1 min-h-12 w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all resize-none"
        rows={4}
      />
    </div>
  );
};

export default PrizeInput;
