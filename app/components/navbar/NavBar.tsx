"use client";

import { FC, useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import Logo from "./Logo";
import HamburgerButton from "./HamburgerButton";
import DesktopNavLinks from "./DesktopNavLinks";
import MobileNavMenu from "./MobileNavMenu";

interface NavBarProps {
  isPrize: boolean;
}

const NavBar: FC<NavBarProps> = ({ isPrize = false }) => {
  const [user, setUser] = useState<{
    username: string;
    userType: string;
  } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const isLoggingOut = useRef(false);

  useEffect(() => {
    if (isLoggingOut.current) {
      isLoggingOut.current = false;
      return;
    }

    fetch("/api/auth/validate")
      .then((res) => res.json())
      .then((data) => {
        if (data.valid && data.user) {
          setUser({ username: data.user.username, userType: data.user.role });
        } else {
          setUser(null);
        }
      })
      .catch(() => {
        setUser(null);
      });
  }, [pathname]);

  const logout = async () => {
    isLoggingOut.current = true;
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout" }),
    });
    setUser(null);
    setIsMenuOpen(false);
    router.push("/");
  };

  const logoutAll = async () => {
    isLoggingOut.current = true;
    await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "logout_all" }),
    });
    setUser(null);
    setIsMenuOpen(false);
    router.push("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="bg-slate-950/80 backdrop-blur-lg border-b border-slate-800/80 sticky top-0 z-50">
      <div className="max-w-[1080px] mx-auto px-6 py-4 flex items-center justify-between">
        <Logo />
        <HamburgerButton
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen((prev) => !prev)}
        />
        <DesktopNavLinks
          user={user}
          onLogout={logout}
          onLogoutAll={logoutAll}
        />
      </div>

      <MobileNavMenu
        isOpen={isMenuOpen}
        user={user}
        onLogout={logout}
        onLogoutAll={logoutAll}
        onClose={closeMenu}
      />
    </nav>
  );
};

export default NavBar;
