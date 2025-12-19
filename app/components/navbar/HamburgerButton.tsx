import { FC } from "react";

interface HamburgerButtonProps {
  isOpen: boolean;
  onToggle: () => void;
}

const HamburgerButton: FC<HamburgerButtonProps> = ({ isOpen, onToggle }) => (
  <button
    onClick={onToggle}
    className="md:hidden flex flex-col gap-1.5 p-1"
    aria-label="Toggle menu"
  >
    <span
      className={`w-6 h-0.5 bg-slate-900 dark:bg-slate-100 transition-all duration-300 ${
        isOpen ? "rotate-45 translate-y-2" : ""
      }`}
    />
    <span
      className={`w-6 h-0.5 bg-slate-900 dark:bg-slate-100 transition-all duration-300 ${
        isOpen ? "opacity-0" : ""
      }`}
    />
    <span
      className={`w-6 h-0.5 bg-slate-900 dark:bg-slate-100 transition-all duration-300 ${
        isOpen ? "-rotate-45 -translate-y-2" : ""
      }`}
    />
  </button>
);

export default HamburgerButton;