import DashboardSidebar from "@/app/components/ui/creator/dashboard/DashboardSidebar";

export default function ProtectedCreatorLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <DashboardSidebar>{children}</DashboardSidebar>;
}
