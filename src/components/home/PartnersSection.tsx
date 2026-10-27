import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

const partnershipKeys = ["sponsoring", "fights", "gyms", "media"] as const;

export default async function PartnersSection() {
  const t = await getTranslations("PartnersSection");

  return (
    <section className="bg-neutral-950 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-orange-500" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-500">
                {t("eyebrow")}
              </span>
            </div>
            <h2 className="text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              {t("title")}
            </h2>
            <p className="mt-4 max-w-2xl text-sm text-neutral-400 sm:text-base">
              {t("description")}
            </p>
          </div>

          <div className="shrink-0">
            <Button href="/partenaires" variant="outline">
              {t("cta")}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {partnershipKeys.map((key, index) => (
            <div
              key={key}
              className="group min-h-[210px] border border-neutral-800 bg-black/40 p-5 transition-colors duration-300 hover:border-neutral-700"
            >
              <span className="text-4xl font-bold leading-none text-orange-900/80">
                {String(index + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-5 text-lg font-extrabold uppercase leading-tight text-white">
                {t(`items.${key}.title`)}
              </h3>
              <p className="mt-4 text-xs leading-relaxed text-neutral-400 sm:text-sm">
                {t(`items.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}