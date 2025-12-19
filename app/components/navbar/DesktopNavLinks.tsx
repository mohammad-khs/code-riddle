import Link from "next/link";
import { FC } from "react";

interface DesktopNavLinksProps {
  user: { username: string; userType: string } | null;
  onLogout: () => void;
}

const DesktopNavLinks: FC<DesktopNavLinksProps> = ({ user, onLogout }) => (
  <div className="hidden md:flex items-center gap-6">
    <nav className="flex items-center gap-4 text-sm text-slate-700 dark:text-slate-200">
      {!user ? (
        <>
          <Link href="/creator/register" className="hover:underline focus:underline">
            Creator Register
          </Link>
          <Link href="/creator/login" className="hover:underline focus:underline">
            Creator Login
          </Link>
          <span className="text-gray-400" aria-hidden="true">|</span>
          <Link href="/solver/login" className="hover:underline focus:underline">
            Solver Login
          </Link>
        </>
      ) : user.userType === "creator" ? (
        <>
          <Link href="/creator/dashboard" className="hover:underline focus:underline">
            Dashboard
          </Link>
          <Link href="/creator/register-solver" className="hover:underline focus:underline">
            Register Solver
          </Link>
        </>
      ) : (
        <Link href="/solver/solve" className="hover:underline focus:underline">
          Solve
        </Link>
      )}
    </nav>

    {user && (
      <div className="flex items-center gap-4 text-sm border-l border-gray-300 dark:border-slate-600 pl-6">
        <div className="text-right">
          <div className="font-medium text-slate-900 dark:text-slate-100">{user.username}</div>
          <div className="text-xs text-slate-600 dark:text-slate-400 capitalize">{user.userType}</div>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="text-xs bg-red-500 hover:bg-red-600 focus:bg-red-600 text-white px-3 py-1.5 rounded transition focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Logout
        </button>
      </div>
    )}
  </div>
);

export default DesktopNavLinks;