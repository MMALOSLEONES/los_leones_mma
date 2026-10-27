"use client";

import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

const LOCALES = ["fr", "en"] as const;

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex items-center gap-2 text-sm font-semibold">
      {LOCALES.map((l) => (
        <button
          key={l}
          onClick={() => router.replace(pathname, { locale: l })}
          className={l === locale ? "text-white" : "text-white/50 hover:text-white"}
          aria-label={l === "fr" ? "Français" : "English"}
        >
          {l.toUpperCase()}
        </button>
      ))}
    </div>
  );
}