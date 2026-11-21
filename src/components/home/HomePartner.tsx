
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function HomePartner() {
  const t = useTranslations("HomePartner");

  return (
    <section className="border-y border-neutral-900 bg-[#050505] px-5 py-8 sm:px-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 sm:flex-row">

        {/* Text */}
        <div className="text-center sm:text-left">
          <p className="text-[9px] font-bold uppercase tracking-[0.25em] text-[#ff6500]">
            {t("eyebrow")}
          </p>

          <h2 className="mt-2 text-sm font-bold uppercase tracking-wide text-white sm:text-base">
            {t("title")}
          </h2>

          <p className="mt-1 text-xs text-neutral-500">
            {t("description")}
          </p>
        </div>

        {/* Partner */}
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 overflow-hidden rounded-sm bg-white p-1">
            <Image
              src="/images/partners/aemma.jpg"
              alt={t("partnerLogoAlt")}
              width={437}
              height={437}
              className="h-full w-full object-contain"
            />
          </div>

          <div>
            <p className="text-sm font-bold uppercase text-white">
              {t("partnerName")}
            </p>

            <p className="mt-1 text-[10px] text-neutral-500">
              {t("partnerSubtitle")}
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}
