import { FC } from "react";

interface LoaderProps {
  message?: string;
}

const Loader: FC<LoaderProps> = ({ message }) => {
  return (
    <div className="flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-slate-700"></div>
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-sky-500 animate-spin"></div>
        </div>
        <p className="text-slate-600 dark:text-slate-400 text-sm">{message}</p>
      </div>
    </div>
  );
};

export default Loader;
