"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { Menu } from "lucide-react";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import MobileMenu from "@/components/layout/MobileMenu";
import Image from "next/image";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const t = useTranslations("Header");
  const navLinks = [
    { href: "/", label: t("nav.home") },
    { href: "/club", label: t("nav.club") },
    { href: "/fighters", label: t("nav.fighters") },
    { href: "/agent", label: t("nav.agent") },
    { href: "/partenaires", label: t("nav.partners") },
    { href: "/actualites", label: t("nav.news") },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-white/10 bg-black/95 backdrop-blur-sm">
        <div className="mx-auto flex max-w-15xl items-center justify-between px-4 py-4 lg:px-8">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo/logo2.png"
              alt={t("logoAlt")}
              width={100}
              height={100}
              priority
            />
            <div className="leading-tight">
              <p className="hidden text-[10px] tracking-widest text-neutral-400 sm:block">
                {t("clubTagline")}
              </p>
            </div>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs font-semibold tracking-widest text-neutral-300 transition hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions desktop */}
          <div className="hidden items-center gap-4 lg:flex">
            <WhatsAppButton variant="outline" />

            <Link
              href="/contact"
              className="text-xs font-semibold tracking-widest text-neutral-300 transition hover:text-white"
            >
              {t("contact")}
            </Link>

            <Link
              href="/candidater"
              className="rounded-md bg-orange-500 px-4 py-2 text-xs font-bold tracking-wide text-black transition hover:bg-orange-400"
            >
              {t("join")}
            </Link>
          </div>

          {/* Actions mobile */}
          <div className="flex items-center gap-4 lg:hidden">
            <Link
              href="/candidater"
              className="rounded-md bg-orange-500 px-3 py-2 text-xs font-bold tracking-wide text-black"
            >
              {t("joinMobile")}
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label={t("openMenu")}
              className="text-white"
            >
              <Menu size={26} />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
