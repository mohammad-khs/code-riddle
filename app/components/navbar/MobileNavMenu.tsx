import Link from "next/link";
import { FC } from "react";

interface MobileNavMenuProps {
  isOpen: boolean;
  user: { username: string; userType: string } | null;
  onLogout: () => void;
  onClose: () => void;
}

const MobileNavMenu: FC<MobileNavMenuProps> = ({ isOpen, user, onLogout, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/95 absolute inset-x-0 top-full z-40 shadow-lg">
      <nav className="max-w-[980px] mx-auto px-6 flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-200 py-4">
        {!user ? (
          <>
            <Link href="/creator/register" className="hover:underline block py-2" onClick={onClose}>
              Creator Register
            </Link>
            <Link href="/creator/login" className="hover:underline block py-2" onClick={onClose}>
              Creator Login
            </Link>
            <div className="border-t border-gray-200 dark:border-slate-600 my-3" />
            <Link href="/solver/login" className="hover:underline block py-2" onClick={onClose}>
              Solver Login
            </Link>
          </>
        ) : user.userType === "creator" ? (
          <>
            <Link href="/creator/dashboard" className="hover:underline block py-2" onClick={onClose}>
              Dashboard
            </Link>
            <Link href="/creator/register-solver" className="hover:underline block py-2" onClick={onClose}>
              Register Solver
            </Link>
          </>
        ) : (
          <Link href="/solver/solve" className="hover:underline block py-2" onClick={onClose}>
            Solve
          </Link>
        )}

        {user && (
          <>
            <div className="border-t border-gray-200 dark:border-slate-600 my-3" />
            <div className="py-2">
              <div className="font-medium text-slate-900 dark:text-slate-100">{user.username}</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">{user.userType}</div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="text-xs bg-red-500 hover:bg-red-600 focus:bg-red-600 text-white px-3 py-2 rounded w-full transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileNavMenu;