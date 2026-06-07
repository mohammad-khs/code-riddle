import Link from "next/link";
import { FC } from "react";

interface MobileNavMenuProps {
  isOpen: boolean;
  user: { username: string; userType: string } | null;
  onLogout: () => void;
  onLogoutAll: () => void;
  onClose: () => void;
}

const MobileNavMenu: FC<MobileNavMenuProps> = ({
  isOpen,
  user,
  onLogout,
  onLogoutAll,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="md:hidden border-t border-slate-800 bg-slate-900/95 backdrop-blur-xl absolute inset-x-0 top-full z-40 shadow-2xl">
      <nav className="max-w-[1080px] mx-auto px-6 flex flex-col gap-2 text-sm font-medium text-slate-300 py-6">
        {!user ? (
          <>
            <Link
              href="/creator/register"
              className="hover:text-blue-400 block py-2"
              onClick={onClose}
            >
              Creator Register
            </Link>
            <Link
              href="/creator/login"
              className="hover:text-blue-400 block py-2"
              onClick={onClose}
            >
              Creator Login
            </Link>
            <div className="border-t border-slate-800 my-2" />
            <Link
              href="/solver/login"
              className="hover:text-blue-400 block py-2"
              onClick={onClose}
            >
              Solver Login
            </Link>
          </>
        ) : user.userType === "creator" ? (
          <>
            <Link
              href="/creator/dashboard"
              className="hover:text-blue-400 block py-2"
              onClick={onClose}
            >
              Dashboard
            </Link>
            <Link
              href="/creator/register-solver"
              className="hover:text-blue-400 block py-2"
              onClick={onClose}
            >
              Register Solver
            </Link>
          </>
        ) : (
          <Link
            href="/solver/solve"
            className="hover:text-blue-400 block py-2"
            onClick={onClose}
          >
            Solve
          </Link>
        )}

        {user && (
          <>
            <div className="border-t border-slate-800 my-4" />
            <div className="py-2 mb-2">
              <div className="font-medium text-slate-50">{user.username}</div>
              <div className="text-xs text-blue-400 capitalize mt-1">
                {user.userType}
              </div>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="text-sm font-bold bg-rose-600 hover:bg-rose-500 text-white px-4 py-2.5 rounded-lg w-full transition-colors"
            >
              Logout
            </button>
            <button
              type="button"
              onClick={onLogoutAll}
              className="text-sm font-bold bg-slate-800 hover:bg-slate-700 text-rose-400 px-4 py-2.5 rounded-lg w-full transition-colors mt-2"
            >
              Logout All Devices
            </button>
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileNavMenu;
