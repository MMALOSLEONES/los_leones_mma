
import Image from "next/image";
import { useTranslations } from "next-intl";

export default function PartnersSection() {
const t = useTranslations("CurrentPartners");

  return (
    <section className="bg-[#050505] px-5 py-20 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-6xl">

        {/* Heading */}
        <div className="mb-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#ff6500]">
            {t("eyebrow")}
          </p>

          <h2 className="mt-3 text-3xl font-black uppercase text-white sm:text-4xl">
            {t("title")}
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-relaxed text-neutral-400 sm:text-base">
            {t("description")}
          </p>
        </div>

        {/* Partner card */}
        <div className="group grid overflow-hidden border border-neutral-800 bg-neutral-900/20 transition-colors duration-300 hover:border-neutral-700 md:grid-cols-[300px_1fr]">

          {/* Logo */}
          <div className="flex aspect-square items-center justify-center overflow-hidden bg-neutral-900 p-5 md:aspect-auto">
            <Image
              src="/images/partners/aemma.jpg"
              alt={t("partnerLogoAlt")}
              width={437}
              height={437}
              className="h-full w-full object-contain transition-transform duration-500 md:group-hover:scale-105"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">

            <span className="mb-5 w-fit border border-[#ff6500]/40 px-3 py-1 text-[9px] font-bold uppercase tracking-[0.2em] text-[#ff6500]">
              {t("partnerLabel")}
            </span>

            <h3 className="text-2xl font-black uppercase text-white sm:text-3xl">
              AEMMA <span className="text-[#ff6500]">– ESPAÑA</span>
            </h3>

            <p className="mt-3 text-sm font-medium text-neutral-400">
              Asociación Española de MMA
            </p>

            <div className="my-6 h-px w-16 bg-[#ff6500]" />

            <p className="max-w-lg text-sm leading-7 text-neutral-400 sm:text-base">
              {t("partnerDescription")}
            </p>

          </div>
        </div>

      </div>
    </section>
  );
}
