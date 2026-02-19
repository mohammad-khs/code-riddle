"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/ui/form/AuthForm";

export default function CreatorRegister() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const router = useRouter();

  async function handleSubmit(e: any) {
    e.preventDefault();
    setMsg("");

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
      // Session is handled via HttpOnly cookie - no need to store token
      // Auto-login after registration
      const loginRes = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          username,
          password,
          userType: "creator",
        }),
      });
      const loginData = await loginRes.json();
      if (loginData.success) {
        router.push("/creator/dashboard");
      } else {
        router.push("/creator/login");
      }
    } else {
      setMsg(j.message || "Error");
    }
  }

  return (
    <AuthForm
      title="Creator Register"
      username={username}
      setUsername={setUsername}
      password={password}
      setPassword={setPassword}
      onSubmit={handleSubmit}
      buttonText="Register"
      message={msg}
    />
  );
}
