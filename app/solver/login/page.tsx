"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SolverLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isloading, setIsloading] = useState(false);
  const router = useRouter();

  async function submit(e: any) {
    setIsloading(true);
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        username,
        password,
        userType: "solver",
      }),
    });
    const j = await res.json();
    if (j.success) {
      localStorage.setItem("token", j.token || "");
      localStorage.setItem("userType", "solver");
      localStorage.setItem("username", username);
      setIsloading(false);
      router.push("/solver/solve");
    } else {
      setMsg(j.message || "Error");
      setIsloading(false);
    }
  }

  return (
    <section className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Login as Solver
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="solver username"
            className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2"
          />
        </div>
        <div>
          <button
            disabled={isloading}
            className="w-full disabled:opacity-50 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md font-medium"
          >
            Login as Solver
          </button>
        </div>
      </form>
      {msg && <div className="mt-3 text-red-600">{msg}</div>}
    </section>
  );
}
