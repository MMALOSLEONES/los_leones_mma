import { apiGet } from "@/lib/api";
import { getGreeting } from "@/lib/greeting";
import DashboardShell from "@/components/dashboard/DashboardShell";
import type { AdminUser } from "@/components/types/api";

// L'espace agent ne doit jamais apparaître dans Google
export const metadata = {
  title: "Espace agent | Los Leones",
  robots: { index: false, follow: false },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Si le token est invalide, apiGet redirige vers /login
  const admin = await apiGet<AdminUser>("/admin/me");

  return (
    <DashboardShell admin={admin} greeting={getGreeting()}>
      {children}
    </DashboardShell>
  );
}
