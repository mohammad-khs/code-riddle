"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RegisterSolver() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is a creator
    const userType = localStorage.getItem("userType");
    const creator = localStorage.getItem("username");
    if (userType !== "creator" || !creator) {
      router.push("/");
      return;
    }
    setCreatorUsername(creator);
    setAuthorized(true);
  }, [router]);

  async function submit(e: any) {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register",
        username,
        password,
        userType: "solver",
        creatorUsername,
      }),
    });
    const j = await res.json();
    if (j.success) {
      setMsg("Solver registered successfully!");
      setUsername("");
      setPassword("");
      setTimeout(() => {
        router.push("/creator/dashboard");
      }, 1000);
    } else {
      setMsg(j.message || "Error registering solver");
    }
  }

  if (!authorized) {
    return null;
  }

  return (
    <section className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Register Solver
      </h2>
      <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
        Creating solver for: <strong>{creatorUsername}</strong>
      </p>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Solver Username
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
        <div className="flex items-center justify-between">
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md">
            Register Solver
          </button>
        </div>
      </form>
      {msg && (
        <div
          className={`mt-3 ${
            msg.includes("successfully") ? "text-green-600" : "text-red-600"
          }`}
        >
          {msg}
        </div>
      )}
    </section>
  );
}
