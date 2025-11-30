"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function Header() {
  const [user, setUser] = useState<{
    username: string;
    userType: string;
  } | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const userType = localStorage.getItem("userType");
    if (username && userType) {
      setUser({ username, userType });
    } else {
      setUser(null);
    }
  }, [pathname]);

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userType");
    setUser(null);
    router.push("/");
  }

  return (
    <header className="bg-white/80 dark:bg-slate-800/70 border-b border-gray-200 dark:border-slate-700">
      <div className="app-container flex items-center justify-between py-3">
        <Link
          href="/"
          className="font-bold text-lg text-slate-900 dark:text-slate-100"
        >
          CodeRiddle
        </Link>
        <div className="flex items-center gap-4">
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            {!user ? (
              <>
                <Link href="/creator/register" className="hover:underline">
                  Creator Register
                </Link>
                <Link href="/creator/login" className="hover:underline">
                  Creator Login
                </Link>
                <span className="hidden sm:block">|</span>
                <Link href="/solver/login" className="hover:underline">
                  Solver Login
                </Link>
              </>
            ) : user.userType === "creator" ? (
              <>
                <Link href="/creator/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <Link href="/creator/register-solver" className="hover:underline">
                  Register Solver
                </Link>
              </>
            ) : (
              <>
                <Link href="/solver/solve" className="hover:underline">
                  Solve
                </Link>
              </>
            )}
          </nav>

          {user && (
            <div className="flex items-center gap-3 text-sm border-l border-gray-200 dark:border-slate-700 pl-3">
              <div className="text-right">
                <div className="font-medium text-slate-900 dark:text-slate-100">
                  {user.username}
                </div>
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  {user.userType}
                </div>
              </div>
              <button
                onClick={logout}
                className="text-xs bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
