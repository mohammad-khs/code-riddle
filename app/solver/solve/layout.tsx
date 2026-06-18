"use client";

export default function SolverSolveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-dvh bg-slate-950 text-slate-50">
      <main className="flex flex-col items-center px-6 pt-12">{children}</main>
    </div>
  );
}