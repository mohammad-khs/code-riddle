"use client";

import Link from "next/link";
import { FC } from "react";
import { usePathname } from "next/navigation";

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
          </>
        )}
      </nav>
    </div>
  );
};

export default MobileNavMenu;
