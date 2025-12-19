import { FC } from "react";

interface FooterProps {
  author?: string;
}

const Footer: FC<FooterProps> = ({ author = "CodeRiddle" }) => {
  return (
    <>
      <footer className="border-t border-gray-200 bg-black/35 backdrop-blur-md dark:border-slate-700 text-sm text-slate-600 dark:text-slate-300">
        <div className="max-w-[1080px] w-full mx-auto md:px-0 px-6 py-4">
          Made with ❤️ — {author}
        </div>
      </footer>
    </>
  );
};

export default Footer;
