"use client";

export default function SolverSolveLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="bg-slate-950 text-slate-50 relative">
      <main className="flex flex-col justify-center items-center">{children}</main>
    </div>
  );
}