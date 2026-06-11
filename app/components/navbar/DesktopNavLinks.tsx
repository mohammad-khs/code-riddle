"use client";

import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";

interface DesktopNavLinksProps {
  user: { username: string; userType: string } | null;
}

const DesktopNavLinks: FC<DesktopNavLinksProps> = ({ user }) => {
  const pathname = usePathname();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="hidden md:flex items-center gap-6">
      <nav className="flex items-center gap-5 text-sm font-medium text-slate-300">
        {!user ? (
          <>
            <Link
              href="/creator/register"
              className={`transition-colors ${
                isActive("/creator/register")
                  ? "text-blue-400"
                  : "hover:text-blue-400"
              }`}
            >
              Creator Register
            </Link>
            <Link
              href="/creator/login"
              className={`transition-colors ${
                isActive("/creator/login")
                  ? "text-blue-400"
                  : "hover:text-blue-400"
              }`}
            >
              Creator Login
            </Link>
            <span className="text-slate-700" aria-hidden="true">
              |
            </span>
            <Link
              href="/solver/login"
              className={`transition-colors ${
                isActive("/solver/login")
                  ? "text-blue-400"
                  : "hover:text-blue-400"
              }`}
            >
              Solver Login
            </Link>
          </>
        ) : user.userType === "creator" ? (
          <>
            <Link
              href="/creator/dashboard"
              className={`transition-colors ${
                isActive("/creator/dashboard")
                  ? "text-blue-400"
                  : "hover:text-blue-400"
              }`}
            >
              Dashboard
            </Link>
            <Link
              href="/creator/register-solver"
              className={`transition-colors ${
                isActive("/creator/register-solver")
                  ? "text-blue-400"
                  : "hover:text-blue-400"
              }`}
            >
              Register Solver
            </Link>
          </>
        ) : (
          <Link
            href="/solver/solve"
            className={`transition-colors ${
              isActive("/solver/solve") ? "text-blue-400" : "hover:text-blue-400"
            }`}
          >
            Solve
          </Link>
        )}
      </nav>

      {user && (
        <div className="flex items-center gap-3 border-l border-slate-700 pl-6 text-sm">
          <div className="text-right">
            <div className="font-medium text-slate-50">{user.username}</div>
            <div className="text-xs capitalize text-blue-400">
              {user.userType}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesktopNavLinks;
