"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { User, UserPlus, Users, LogOut, LogOutIcon } from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

interface DashboardSidebarProps {
  children: React.ReactNode;
}

interface NavItem {
  href: string;
  label: string;
  icon: React.ElementType;
}

type LogoutAction = "logout" | "logout_all";

// ─── Constants ────────────────────────────────────────────────────────────────

const NAV_ITEMS: NavItem[] = [
  { href: "/creator/dashboard/profile", label: "Profile", icon: User },
  {
    href: "/creator/register-solver",
    label: "Create New Solver",
    icon: UserPlus,
  },
  {
    href: "/creator/dashboard/manage-solver",
    label: "Manage Solver",
    icon: Users,
  },
];

const AUTH_API = "/api/auth";

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function postAuthAction(action: LogoutAction): Promise<void> {
  await fetch(AUTH_API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action }),
  });
}

// ─── Sub-components ───────────────────────────────────────────────────────────

interface NavLinkProps {
  item: NavItem;
  isActive: boolean;
}

function NavLink({ item, isActive }: NavLinkProps) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={[
        "group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-semibold transition-all duration-300",
        isActive
          ? "border-blue-400/40 bg-blue-600/15 text-blue-50 shadow-[0_0_24px_rgba(59,130,246,0.18)]"
          : "border-slate-800/80 bg-slate-900/35 text-slate-300 hover:border-blue-500/30 hover:bg-blue-600/10 hover:text-slate-50",
      ].join(" ")}
    >
      <Icon
        className={[
          "h-5 w-5 transition-transform duration-300",
          isActive
            ? "text-blue-300"
            : "text-slate-500 group-hover:text-blue-300",
        ].join(" ")}
        aria-hidden="true"
      />
      <span>{item.label}</span>
    </Link>
  );
}

interface LogoutButtonProps {
  label: string;
  icon: React.ElementType;
  isLoading: boolean;
  onClick: () => void;
}

function LogoutButton({
  label,
  icon: Icon,
  isLoading,
  onClick,
}: LogoutButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={isLoading}
      className="group flex w-full items-center gap-3 rounded-xl border border-slate-800/80 bg-slate-900/35 px-4 py-3 text-left text-sm font-semibold text-slate-300 transition-all duration-300 hover:border-rose-500/30 hover:bg-rose-600/10 hover:text-rose-50 disabled:cursor-not-allowed disabled:opacity-60"
    >
      <Icon
        className="h-5 w-5 text-slate-500 transition-colors group-hover:text-rose-300"
        aria-hidden="true"
      />
      <span>{isLoading ? "Logging out..." : label}</span>
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardSidebar({ children }: DashboardSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isLoggingOutAll, setIsLoggingOutAll] = useState(false);

  // Validate session on mount
  useEffect(() => {
    let cancelled = false;

    fetch("/api/auth/validate")
      .then((res) => {
        if (!res.ok) throw new Error("Validation request failed");
        return res.json() as Promise<{
          valid: boolean;
          user?: { role: string };
        }>;
      })
      .then((data) => {
        if (cancelled) return;
        if (!data.valid || data.user?.role !== "creator") {
          router.push("/creator/login");
        }
      })
      .catch(() => {
        if (!cancelled) router.push("/creator/login");
      });

    return () => {
      cancelled = true;
    };
  }, [router]);

  const handleLogout = useCallback(() => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    postAuthAction("logout")
      .then(() => router.push("/creator/login"))
      .finally(() => setIsLoggingOut(false));
  }, [isLoggingOut, router]);

  const handleLogoutAll = useCallback(() => {
    if (isLoggingOutAll) return;
    setIsLoggingOutAll(true);
    postAuthAction("logout_all")
      .then(() => router.push("/creator/login"))
      .finally(() => setIsLoggingOutAll(false));
  }, [isLoggingOutAll, router]);

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-slate-950 pt-20 pb-3 ">
      <div className="grid h-full w-full max-w-[1080px] grid-cols-[288px_minmax(0,1fr)] gap-4">
        {/* ── Sidebar ── */}
        <aside
          className="flex flex-col justify-between gap-6 rounded-3xl border border-slate-800 bg-slate-900/60 p-4 shadow-2xl shadow-blue-950/30 backdrop-blur-xl"
          aria-label="Creator sidebar"
        >
          {/* Top section */}
          <div className="space-y-6">
            {/* Header */}
            <header className="space-y-2 px-2 pb-4">
              <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
                Creator
              </p>
              <h1 className="text-2xl font-extrabold text-slate-50">
                Dashboard
              </h1>
            </header>

            {/* Navigation */}
            <nav
              className="space-y-3"
              aria-label="Creator dashboard navigation"
            >
              <ul role="list" className="space-y-3">
                {NAV_ITEMS.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  return (
                    <li key={item.href}>
                      <NavLink item={item} isActive={isActive} />
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>

          {/* Bottom session controls */}
          <div className="space-y-3 border-t border-slate-800/80 pt-4">
            <LogoutButton
              label="Log Out"
              icon={LogOut}
              isLoading={isLoggingOut}
              onClick={handleLogout}
            />
            <LogoutButton
              label="Log Out All Devices"
              icon={LogOutIcon}
              isLoading={isLoggingOutAll}
              onClick={handleLogoutAll}
            />
          </div>
        </aside>

        {/* ── Main content ── */}
        <main className="min-h-0 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
