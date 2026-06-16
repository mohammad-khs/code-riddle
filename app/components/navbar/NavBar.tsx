"use client";

import { FC, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import HamburgerButton from "./HamburgerButton";
import DesktopNavLinks from "./DesktopNavLinks";
import MobileNavMenu from "./MobileNavMenu";

const NavBar: FC = () => {
  const [user, setUser] = useState<{
    username: string;
    userType: string;
  } | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
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

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-lg">
      <div className="mx-auto flex max-w-[1080px] items-center justify-between px-6 py-4">
        <Logo />
        <HamburgerButton
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen((prev) => !prev)}
        />
        <DesktopNavLinks user={user} />
      </div>

      <MobileNavMenu isOpen={isMenuOpen} user={user} onClose={closeMenu} />
    </nav>
  );
};

export default NavBar;
