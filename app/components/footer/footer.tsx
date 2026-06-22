import { FC } from "react";

interface FooterProps {
  author?: string;
}

const Footer: FC<FooterProps> = ({ author = "CodeRiddle" }) => {
  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 backdrop-blur-md text-sm text-slate-400">
      <div className="max-w-[1080px] w-full mx-auto px-6 py-6 flex items-center justify-center md:justify-start">
        <p>
          Made with <span className="text-rose-500 animate-pulse">❤️</span> —{" "}
          <span className="text-slate-300 font-medium">{author}</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
