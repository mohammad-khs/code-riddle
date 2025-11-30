import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg p-6">
        <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-green-500">
          CodeRiddle
        </h1>
        <p className="text-lg text-slate-700 dark:text-slate-200 mt-4 leading-relaxed">
          Challenge your mind with custom riddles. Whether you're a puzzle master crafting brain-bending challenges or a solver ready to test your wits, CodeRiddle is your ultimate riddle platform.
        </p>
        <p className="text-slate-600 dark:text-slate-300 mt-3">
          Create personalized riddle collections with celebratory rewards, or jump into solving riddles crafted just for you. Every correct answer brings you closer to victory.
        </p>

        <div className="flex flex-wrap gap-3 mt-6">
          <Link
            href="/creator/register"
            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md font-medium transition"
          >
            Create Riddles
          </Link>

          <Link
            href="/solver/login"
            className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-md font-medium transition"
          >
            Solve Riddles
          </Link>
        </div>
      </section>
    </div>
  );
}
