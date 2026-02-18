"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/ui/form/AuthForm";

export default function SolverLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [creatorUsername, setCreatorUsername] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

    if (!creatorUsername) {
      setMsg("Creator username is required");
      setIsLoading(false);
      return;
    }

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "login",
        username,
        password,
        userType: "solver",
        creatorUsername,
      }),
    });

    const j = await res.json();

    if (j.success) {
      // Session is handled via HttpOnly cookie - no need to store token
      router.push("/solver/solve");
    } else {
      setMsg(j.message || "Error");
      setIsLoading(false);
    }
  }

  return (
    <AuthForm
      title="Login as Solver"
      subtitle={
        <div className="text-sm text-slate-600 dark:text-slate-400 mb-4">
          Enter your credentials and your creator&apos;s username
        </div>
      }
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      creatorUsername={creatorUsername}
      setCreatorUsername={setCreatorUsername}
      onSubmit={handleSubmit}
      buttonText="Login as Solver"
      message={msg}
      isLoading={isLoading}
      buttonColor="green"
    />
  );
}
