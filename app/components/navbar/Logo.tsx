import Link from "next/link";
import { FC } from "react";

const Logo: FC = () => (
  <Link
    href="/"
    className="font-bold text-lg text-slate-900 dark:text-slate-100 hover:opacity-80 transition"
  >
    CodeRiddle
  </Link>
);

export default Logo;