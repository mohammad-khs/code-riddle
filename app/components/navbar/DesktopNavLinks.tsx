import Link from "next/link";
import { FC } from "react";
import { Button } from "../ui/button";

interface DesktopNavLinksProps {
  user: { username: string; userType: string } | null;
  onLogout: () => void;
  onLogoutAll: () => void;
}

const DesktopNavLinks: FC<DesktopNavLinksProps> = ({
  user,
  onLogout,
  onLogoutAll,
}) => (
  <div className="hidden md:flex items-center gap-6">
    <nav className="flex items-center gap-5 text-sm font-medium text-slate-300">
      {!user ? (
        <>
          <Link
            href="/creator/register"
            className="hover:text-blue-400 transition-colors"
          >
            Creator Register
          </Link>
          <Link
            href="/creator/login"
            className="hover:text-blue-400 transition-colors"
          >
            Creator Login
          </Link>
          <span className="text-slate-700" aria-hidden="true">
            |
          </span>
          <Link
            href="/solver/login"
            className="hover:text-blue-400 transition-colors"
          >
            Solver Login
          </Link>
        </>
      ) : user.userType === "creator" ? (
        <>
          <Link
            href="/creator/dashboard"
            className="hover:text-blue-400 transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/creator/register-solver"
            className="hover:text-blue-400 transition-colors"
          >
            Register Solver
          </Link>
        </>
      ) : (
        <Link
          href="/solver/solve"
          className="hover:text-blue-400 transition-colors"
        >
          Solve
        </Link>
      )}
    </nav>

    {user && (
      <div className="flex items-center gap-4 text-sm border-l border-slate-700 pl-6">
        <div className="text-right">
          <div className="font-medium text-slate-50">{user.username}</div>
          <div className="text-xs text-blue-400 capitalize">
            {user.userType}
          </div>
        </div>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onLogout}
          className="bg-rose-600/90 hover:bg-rose-600 text-white border-none"
        >
          Logout
        </Button>
        <Button
          type="button"
          variant="destructive"
          size="sm"
          onClick={onLogoutAll}
          className="bg-rose-900/80 hover:bg-rose-800 text-rose-100 border-none"
        >
          Logout All
        </Button>
      </div>
    )}
  </div>
);

export default DesktopNavLinks;
