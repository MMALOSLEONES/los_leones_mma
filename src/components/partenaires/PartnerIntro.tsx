import { getTranslations } from "next-intl/server";

const highlightKeys = ["roster", "communication", "events", "reporting"] as const;

export default async function PartnerIntro() {
  const t = await getTranslations("PartnerIntro");

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
            {t("eyebrow")}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-6 text-neutral-400">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
          {highlightKeys.map((key) => (
            <div key={key} className="bg-black p-6">
              <h3 className="text-sm font-bold tracking-wide text-orange-500">
                {t(`highlights.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {t(`highlights.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}