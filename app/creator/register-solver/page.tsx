"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/ui/form/AuthForm";
import { AuthRequestBody } from "@/types/auth";
export default function RegisterSolver() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [creatorUsername, setCreatorUsername] = useState("");

  const router = useRouter();

  useEffect(() => {
    // Validate session with the server
    fetch("/api/auth/validate")
      .then((res) => res.json())
      .then((data) => {
        if (!data.valid || data.user.role !== "creator") {
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

  async function handleSubmit(e: React.FormEvent<Element>) {
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
        router.push("/creator/dashboard");
      }, 1000);
    } else {
      setMsg(j.message || "Error registering solver");
    }
  }

  if (!authorized) return null;

  return (
    <AuthForm
      title="Register Solver"
      subtitle={
        <>
          Creating solver for: <strong>{creatorUsername}</strong>
        </>
      }
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      buttonText="Register Solver"
      buttonColor="sky"
      message={msg}
    />
  );
}
