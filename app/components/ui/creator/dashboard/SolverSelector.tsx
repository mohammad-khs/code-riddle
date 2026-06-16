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
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-1.5">
        Select Solver
      </label>
      <select
        title="Select solver"
        value={selectedSolver}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all appearance-none cursor-pointer"
      >
        <option value="" className="bg-slate-900">Select solver...</option>
        {solvers.map((s) => (
          <option key={s} value={s} className="bg-slate-900">
            {s}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SolverSelector;
