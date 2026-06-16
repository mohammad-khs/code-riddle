"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/ui/form/AuthForm";
import { AuthRequestBody } from "@/types/auth";

export default function CreateSolver() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/validate")
      .then((res) => res.json())
      .then((data) => {
        if (!data.valid || data.user?.role !== "creator") {
          router.push("/creator/login");
          return;
        }

        setCreatorUsername(data.user.username);
        setAuthorized(true);
      })
      .catch(() => {
        router.push("/creator/login");
      });
  }, [router]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMsg("");

    const bodyContent: AuthRequestBody = {
      action: "register",
      username,
      password,
      userType: "solver",
      creatorUsername,
    };

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(bodyContent),
    });

    const j = await res.json();

    if (j.success) {
      setMsg("Solver registered successfully!");
      setUsername("");
      setPassword("");
      setTimeout(() => {
        router.push("/creator/dashboard/manage-solver");
      }, 1000);
    } else {
      setMsg(j.message || "Error registering solver");
    }
  }

  if (!authorized) {
    return (
      <section className="flex h-full items-center justify-center rounded-3xl border border-slate-800 bg-slate-900/50 p-8 text-center text-slate-300 backdrop-blur-xl">
        Loading creator session...
      </section>
    );
  }

  return (
    <section className="h-full overflow-y-auto rounded-3xl border border-slate-800 bg-slate-900/60 shadow-2xl shadow-blue-950/30 backdrop-blur-xl">
      <div className="border-b border-slate-800 bg-slate-950/50 p-6">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-blue-400">
          Create New Solver
        </p>
        <h2 className="mt-2 text-2xl font-extrabold text-slate-50">
          Add Solver Account
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Create a solver under your creator account.
        </p>
      </div>

      <div className="p-6">
        <AuthForm
          title="Register Solver"
          subtitle={
            <span className="text-sm text-slate-400">
              Creating solver for:{" "}
              <strong className="text-blue-300">{creatorUsername}</strong>
            </span>
          }
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          onSubmit={handleSubmit}
          buttonText="Register Solver"
          message={msg}
        />
      </div>
    </section>
  );
}
