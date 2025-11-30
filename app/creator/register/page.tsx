"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatorRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function submit(e: any) {
    e.preventDefault();
    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "register",
        username,
        password,
        userType: "creator",
      }),
    });
    const j = await res.json();
    if (j.success) {
      localStorage.setItem("token", j.token || "");
      localStorage.setItem("userType", "creator");
      localStorage.setItem("username", username);
      window.location.reload();
    } else {
      setMsg(j.message || "Error");
    }
  }

  return (
    <section className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
        Creator Register
      </h2>
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Username
          </label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
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
            Register
          </button>
        </div>
      </form>
      {msg && <div className="mt-3 text-red-600">{msg}</div>}
    </section>
  );
}
