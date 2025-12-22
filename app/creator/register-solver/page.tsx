"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/app/components/ui/form/AuthForm";

export default function RegisterSolver() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [authorized, setAuthorized] = useState(false);

  // Initialize creatorUsername from localStorage to avoid setState in effect
  const [creatorUsername, setCreatorUsername] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("username") || "";
    }
    return "";
  });

  const router = useRouter();

  useEffect(() => {
    // Handle authorization check
    const checkAuthorization = () => {
      try {
        const userType = localStorage.getItem("userType");
        const creator = localStorage.getItem("username");

        if (userType !== "creator" || !creator) {
          router.push("/");
          return;
        }

        // Only update state if creator username has changed
        if (creator !== creatorUsername) {
          setCreatorUsername(creator);
        }
        setAuthorized(true);
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        router.push("/");
      }
    };

    checkAuthorization();
  }, [router, creatorUsername]);

  async function handleSubmit(e: React.FormEvent<Element>) {
    e.preventDefault();
    setMsg("");

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

  if (!authorized) return null;

  return (
    <AuthForm
      title="Register Solver"
      subtitle={
        <p>
          Creating solver for: <strong>{creatorUsername}</strong>
        </p>
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
