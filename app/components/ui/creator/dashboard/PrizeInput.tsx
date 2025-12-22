import { FC } from "react";

interface PrizeInputProps {
  prizeLetter: string;
  onUpdate: (value: string) => void;
}

const PrizeInput: FC<PrizeInputProps> = ({ prizeLetter, onUpdate }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
        Prize Letter
      </label>
      <textarea
        title="Prize Letter"
        value={prizeLetter}
        onChange={(e) => onUpdate(e.target.value)}
        className="mt-1 min-h-12 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
      />
    </div>
  );
};

export default PrizeInput;
