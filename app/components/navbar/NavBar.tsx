"use client";

import { FC, useEffect, useState } from "react";
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

  useEffect(() => {
    const username = localStorage.getItem("username");
    const userType = localStorage.getItem("userType");
    if (username && userType) {
      setUser({ username, userType });
    } else {
      setUser(null);
    }
  }, [pathname]);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    localStorage.removeItem("userType");
    setUser(null);
    setIsMenuOpen(false);
    router.push("/");
  };

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav className="dark:bg-black/35 backdrop-blur-md border-b border-gray-200 dark:border-slate-700 sticky top-0 z-50">
      <div className="max-w-[1080px] mx-auto md:px-0 px-6 flex items-center justify-between py-3">
        <Logo />
        <HamburgerButton
          isOpen={isMenuOpen}
          onToggle={() => setIsMenuOpen((prev) => !prev)}
        />
        <DesktopNavLinks user={user} onLogout={logout} />
      </div>

      <MobileNavMenu
        isOpen={isMenuOpen}
        user={user}
        onLogout={logout}
        onClose={closeMenu}
      />
    </nav>
  );
};

export default NavBar;
