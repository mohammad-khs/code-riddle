import { FC } from "react";

interface FooterProps {}

const Footer: FC<FooterProps> = () => {
  return (
    <>
      <footer className="border-t border-gray-200 dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
        <div className="max-w-[980px] w-full mx-auto px-6 py-4">
          Made with ❤️ — CodeRiddle
        </div>
      </footer>
    </>
  );
};

export default Footer;
