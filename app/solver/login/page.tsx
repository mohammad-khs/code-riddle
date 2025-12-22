"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/ui/form/AuthForm";

export default function SolverLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setIsLoading(true);
    setMsg("");

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
      router.push("/solver/solve");
    } else {
      setMsg(j.message || "Error");
      setIsLoading(false);
    }
  }

  return (
    <AuthForm
      title="Login as Solver"
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      buttonText="Login as Solver"
      message={msg}
      isLoading={isLoading}
      buttonColor="green"
    />
  );
}
