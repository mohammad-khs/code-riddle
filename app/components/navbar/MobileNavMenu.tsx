"use client";

import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

interface MobileNavMenuProps {
  isOpen: boolean;
  user: { username: string; userType: string } | null;
  onClose: () => void;
}

const MobileNavMenu: FC<MobileNavMenuProps> = ({ isOpen, user, onClose }) => {
  const pathname = usePathname();

  if (!isOpen) return null;

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const linkClass = (href: string) =>
    `block py-2 transition-colors ${
      isActive(href) ? "text-blue-400" : "hover:text-blue-400"
    }`;

  async function handleLogout() {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    window.location.href = "/";
  }

  return (
    <div className="absolute inset-x-0 top-full z-40 border-t border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur-xl md:hidden">
      <nav className="mx-auto flex max-w-[1080px] flex-col gap-2 px-6 py-6 text-sm font-medium text-slate-300">
        {!user ? (
          <>
            <Link
              href="/creator/register"
              className={linkClass("/creator/register")}
              onClick={onClose}
            >
              Creator Register
            </Link>
            <Link
              href="/creator/login"
              className={linkClass("/creator/login")}
              onClick={onClose}
            >
              Creator Login
            </Link>
            <div className="my-2 border-t border-slate-800" />
            <Link
              href="/solver/login"
              className={linkClass("/solver/login")}
              onClick={onClose}
            >
              Solver Login
            </Link>
          </>
        ) : user.userType === "creator" ? (
          <>
            <Link
              href="/creator/dashboard"
              className={linkClass("/creator/dashboard")}
              onClick={onClose}
            >
              Dashboard
            </Link>
          </>
        ) : (
          <Link
            href="/solver/solve"
            className={linkClass("/solver/solve")}
            onClick={onClose}
          >
            Solve
          </Link>
        )}

        {user && (
          <>
            <div className="my-4 border-t border-slate-800" />
            <div className="mb-2 py-2">
              <div className="font-medium text-slate-50">{user.username}</div>
              <div className="mt-1 text-xs capitalize text-blue-400">
                {user.userType}
              </div>
            </div>
            {user?.userType === "solver" && (
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/35 px-4 py-2 text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-rose-500/30 hover:bg-rose-600/10 hover:text-rose-50"
              >
                <LogOut className="h-4 w-4" />
                Log Out
              </button>
            )}
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileNavMenu;
