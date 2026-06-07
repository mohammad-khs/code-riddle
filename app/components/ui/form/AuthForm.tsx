"use client";

import { FormEvent } from "react";
import { Button } from "../button";

type AuthFormProps = {
  title: string;
  subtitle?: string | React.ReactNode;
  username: string;
  setUsername: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  creatorUsername?: string;
  setCreatorUsername?: (value: string) => void;
  onSubmit: (e: FormEvent) => Promise<void>;
  buttonText: string;
  message: string;
  isLoading?: boolean;
  buttonDisabled?: boolean;
};

export default function AuthForm({
  title,
  subtitle,
  username,
  setUsername,
  password,
  setPassword,
  creatorUsername,
  setCreatorUsername,
  onSubmit,
  buttonText,
  message,
  isLoading = false,
  buttonDisabled = false,
}: AuthFormProps) {
  const isSuccessMessage =
    message.toLowerCase().includes("success") ||
    message.toLowerCase().includes("successfully");

  return (
    <section className="bg-slate-900/50 backdrop-blur-md border border-slate-800/80 rounded-2xl p-8 max-w-md mx-auto shadow-2xl">
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-slate-50 mb-2">{title}</h2>
        {subtitle && <p className="text-sm text-slate-400">{subtitle}</p>}
      </div>

      <form onSubmit={onSubmit} className="space-y-5">
        {setCreatorUsername && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1.5">
              Creator Username
            </label>
            <input
              type="text"
              value={creatorUsername || ""}
              onChange={(e) => setCreatorUsername(e.target.value)}
              placeholder="Enter creator username"
              required
              className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1.5">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
            className="w-full rounded-lg border border-slate-800 bg-slate-950/50 px-4 py-2.5 text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            disabled={isLoading || buttonDisabled}
            className="w-full py-2.5 text-base font-semibold"
          >
            {isLoading ? "Processing..." : buttonText}
          </Button>
        </div>
      </form>

      {message && (
        <div
          className={`mt-6 p-3 rounded-lg text-sm font-medium border text-center ${
            isSuccessMessage
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border-rose-500/20"
          }`}
        >
          {message}
        </div>
      )}
    </section>
  );
}
