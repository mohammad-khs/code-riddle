import { FC } from "react";

interface SolverSelectorProps {
  solvers: string[];
  selectedSolver: string;
  onChange: (solver: string) => void;
}

const SolverSelector: FC<SolverSelectorProps> = ({
  solvers,
  selectedSolver,
  onChange,
}) => {
  return (
    <select
      title="Select solver"
      value={selectedSolver}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
    >
      <option value="">Select solver...</option>
      {solvers.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
};

export default SolverSelector;
