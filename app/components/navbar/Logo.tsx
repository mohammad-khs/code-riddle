import Link from "next/link";
import { FC } from "react";

const Logo: FC = () => (
  <Link
    href="/"
    className="font-extrabold text-xl tracking-tight text-slate-50 hover:opacity-80 transition-opacity"
  >
    Code<span className="text-blue-500">Riddle</span>
  </Link>
);

export default Logo;
