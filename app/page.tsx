import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg p-6">
        <h1 className="text-2xl font-bold">Welcome to CodeRiddle</h1>
        <p className="text-slate-700 dark:text-slate-200 mt-2">
          Create custom riddle sets with a prize letter and optional celebratory
          music, or solve riddles created for you.
        </p>

        <div className="flex flex-wrap gap-3 mt-4">
          <Link
            href="/creator/register"
            className="inline-block bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md"
          >
            Create Riddles
          </Link>
          <Link
            href="/creator/dashboard"
            className="inline-block bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded-md"
          >
            Creator Dashboard
          </Link>
          <Link
            href="/solver/solve"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-md"
          >
            Solve Riddles
          </Link>
        </div>
      </section>

      <section className="mt-6 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg p-6">
        <h3 className="font-semibold">How it works</h3>
        <ol className="list-decimal list-inside mt-2 text-slate-700 dark:text-slate-200">
          <li>Creator registers and adds as many riddles as they want.</li>
          <li>
            Creator sets the prize letter and optionally uploads a music file.
          </li>
          <li>
            Solver registers/logs in and answers the riddles sequentially.
          </li>
          <li>
            If all answers are correct, the prize letter is revealed and music
            plays.
          </li>
        </ol>
      </section>
    </div>
  );
}
