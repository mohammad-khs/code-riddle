"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function SolverRegister() {
  const router = useRouter();

  useEffect(() => {
    // Solvers can only be registered by creators, redirect to creator login
    router.push("/creator/login");
  }, [router]);

  return null;
}
