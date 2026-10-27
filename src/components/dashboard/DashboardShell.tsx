"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  Users,
  Newspaper,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import type { AdminUser } from "@/components/types/api";

const navItems = [
  { label: "Vue d'ensemble", href: "/dashboard", icon: LayoutDashboard },
  { label: "Candidatures", href: "/dashboard/candidatures", icon: ClipboardList },
  { label: "Fighters", href: "/dashboard/fighters", icon: Users },
  { label: "Articles", href: "/dashboard/articles", icon: Newspaper },
];

function SidebarContent({
  pathname,
  onNavigate,
  onLogout,
}: {
  pathname: string;
  onNavigate: () => void;
  onLogout: () => void;
}) {
  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <>
      <div>
        <p className="text-sm font-extrabold tracking-wide text-white">
          LOS LEONES
        </p>
        <p className="mt-1 text-[10px] tracking-widest text-orange-500">
          ESPACE AGENT
        </p>
      </div>

      <nav className="mt-10 flex-1 space-y-1">
        {navItems.map(({ label, href, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold transition ${
              isActive(href)
                ? "bg-orange-500 text-black"
                : "text-neutral-300 hover:bg-white/5 hover:text-white"
            }`}
          >
            <Icon size={18} />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={onLogout}
        className="flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-semibold text-neutral-400 transition hover:bg-white/5 hover:text-white"
      >
        <LogOut size={18} />
        Déconnexion
      </button>
    </>
  );
}

export default function DashboardShell({
  admin,
  greeting,
  children,
}: {
  admin: AdminUser;
  greeting: string;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const logout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-black text-white lg:flex">
      {/* Menu latéral — écrans larges */}
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-neutral-950 p-5 lg:flex">
        <SidebarContent
          pathname={pathname}
          onNavigate={() => {}}
          onLogout={logout}
        />
      </aside>

      {/* Menu latéral — tiroir sur mobile */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/70"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute left-0 top-0 flex h-full w-64 flex-col border-r border-white/10 bg-neutral-950 p-5">
            <button
              onClick={() => setOpen(false)}
              aria-label="Fermer le menu"
              className="mb-4 self-end text-neutral-400"
            >
              <X size={22} />
            </button>
            <SidebarContent
              pathname={pathname}
              onNavigate={() => setOpen(false)}
              onLogout={logout}
            />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-4 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setOpen(true)}
              aria-label="Ouvrir le menu"
              className="text-white lg:hidden"
            >
              <Menu size={24} />
            </button>
            <p className="text-lg font-bold text-white">
              {greeting}, {admin.prenom} {admin.nom}
            </p>
          </div>
          <span className="hidden text-xs text-neutral-500 sm:block">
            {admin.mail}
          </span>
        </header>

        <main className="flex-1 px-4 py-8 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
