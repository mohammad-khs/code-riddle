"use client";
import Link from "next/link";
import { FC, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface HeaderProps {
  isPrize: boolean;
}

const Header: FC<HeaderProps> = ({ isPrize = false }) => {
  const [user, setUser] = useState<{
    username: string;
    userType: string;
  } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
    setIsMenuOpen(false);
    router.push("/");
  }

  return (
    <header className="bg-white/80 dark:bg-slate-800/70 border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-[980px] mx-auto px-6 flex items-center justify-between py-3">
        <Link
          href="/"
          className="font-bold text-lg text-slate-900 dark:text-slate-100"
        >
          CodeRiddle
        </Link>

        {/* Hamburger menu button - visible on small screens */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden flex flex-col gap-1.5 p-1"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-slate-900 dark:bg-slate-100 transition-all ${
              isMenuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-slate-900 dark:bg-slate-100 transition-all ${
              isMenuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`w-6 h-0.5 bg-slate-900 dark:bg-slate-100 transition-all ${
              isMenuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4">
          <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
            {!user ? (
              <>
                <Link href="/creator/register" className="hover:underline">
                  Creator Register
                </Link>
                <Link href="/creator/login" className="hover:underline">
                  Creator Login
                </Link>
                <span>|</span>
                <Link href="/solver/login" className="hover:underline">
                  Solver Login
                </Link>
              </>
            ) : user.userType === "creator" ? (
              <>
                <Link href="/creator/dashboard" className="hover:underline">
                  Dashboard
                </Link>
                <Link
                  href="/creator/register-solver"
                  className="hover:underline"
                >
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
            <div className="flex items-center gap-3 text-sm border-l border-gray-200  pl-3">
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

      {/* Mobile Menu - overlay */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800/95 absolute z-50 w-full left-0">
          <nav className="max-w-[980px] mx-auto px-6 flex flex-col gap-3 text-sm text-slate-700 dark:text-slate-200 py-4">
            {!user ? (
              <>
                <Link
                  href="/creator/register"
                  className="hover:underline block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Creator Register
                </Link>
                <Link
                  href="/creator/login"
                  className="hover:underline block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Creator Login
                </Link>
                <div className="border-t border-gray-200 my-2"></div>
                <Link
                  href="/solver/login"
                  className="hover:underline block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Solver Login
                </Link>
              </>
            ) : user.userType === "creator" ? (
              <>
                <Link
                  href="/creator/dashboard"
                  className="hover:underline block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/creator/register-solver"
                  className="hover:underline block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register Solver
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/solver/solve"
                  className="hover:underline block py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Solve
                </Link>
              </>
            )}

            {user && (
              <>
                <div className="border-t border-gray-200  my-2"></div>
                <div className="py-2">
                  <div className="font-medium text-slate-900 dark:text-slate-100">
                    {user.username}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">
                    {user.userType}
                  </div>
                </div>
                <button
                  onClick={logout}
                  className="text-xs bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded w-full"
                >
                  Logout
                </button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
