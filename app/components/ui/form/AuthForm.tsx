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
  return (
    <section className="bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-lg p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-semibold mb-4 text-slate-900 dark:text-slate-100">
        {title}
      </h2>

      {subtitle && (
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          {subtitle}
        </p>
      )}

      <form onSubmit={onSubmit} className="space-y-4">
        {setCreatorUsername && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
              Creator Username
            </label>
            <input
              type="text"
              value={creatorUsername || ""}
              onChange={(e) => setCreatorUsername(e.target.value)}
              placeholder="creator username"
              required
              className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="username"
            required
            className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            required
            className="mt-1 w-full rounded-md border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <Button
            type="submit"
            disabled={isLoading || buttonDisabled}
            className={`w-full disabled:opacity-50 text-white px-4 py-2 rounded-md font-medium transition`}
          >
            {isLoading ? "Loading..." : buttonText}
          </Button>
        </div>
      </form>

      {message && (
        <div
          className={`mt-3 font-medium ${
            message.includes("success") || message.includes("successfully")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {message}
        </div>
      )}
    </section>
  );
}
