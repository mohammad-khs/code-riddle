"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/ui/form/AuthForm";

export default function CreatorLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
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
        userType: "creator",
      }),
    });

    const j = await res.json();

    if (j.success) {
      router.push("/creator/dashboard/manage-solver");
    } else {
      setMsg(j.message || "Error");
      setIsLoading(false);
    }
  }

  return (
    <AuthForm
      title="Login as Creator"
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      buttonText="Login as Creator"
      message={msg}
      isLoading={isLoading}
    />
  );
}
