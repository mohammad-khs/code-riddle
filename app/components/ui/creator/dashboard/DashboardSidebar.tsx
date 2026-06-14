"use client";

import Link from "next/link";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";

interface DashboardSidebarProps {
  children: React.ReactNode;
}

const sections = [
  { href: "/creator/dashboard/profile", label: "Profile" },
  { href: "/creator/register-solver", label: "Create New Solver" },
  { href: "/creator/dashboard/manage-solver", label: "Manage Solver" },
];

export default function DashboardSidebar({ children }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/validate")
      .then((res) => res.json())
      .then((data) => {
        if (!data.valid || data.user?.role !== "creator") {
          router.push("/creator/login");
        }
      })
      .catch(() => {
        router.push("/creator/login");
      });
  }, [router]);

  const logout = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    router.push("/creator/login");
  };

  const logoutAll = async () => {
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout_all" }),
    });
    router.push("/creator/login");
  };

  return (
    <div className="bg-slate-950">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="order-2 lg:order-1">
          <div className="sticky flex flex-col rounded-3xl border border-slate-800 bg-slate-900/70 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-transparent to-sky-500/5" />

            <div className="relative flex flex-col space-y-6">
              <div className="px-2 pt-2">
                <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
                  Creator
                </p>
                <h2 className="mt-2 text-xl font-extrabold text-slate-50">
                  Dashboard
                </h2>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-2">
                <nav className="space-y-1" aria-label="Creator dashboard">
                  {sections.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(`${item.href}/`);

                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={`block rounded-xl px-3 py-2.5 text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-blue-600 text-white shadow-lg shadow-blue-900/30"
                            : "text-slate-300 hover:bg-slate-800 hover:text-slate-50"
                        }`}
                      >
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="mt-auto rounded-2xl border border-rose-500/20 bg-rose-500/10 p-2">
                <button
                  type="button"
                  onClick={logout}
                  className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold text-rose-300 transition-colors hover:bg-rose-500/20 hover:text-rose-100"
                >
                  Log Out
                </button>
                <button
                  type="button"
                  onClick={logoutAll}
                  className="mt-1 w-full rounded-xl px-3 py-2.5 text-left text-sm font-bold text-slate-300 transition-colors hover:bg-slate-800 hover:text-slate-50"
                >
                  Log Out All
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="order-1 min-w-0 lg:order-2">{children}</main>
      </div>
    </div>
  );
}
