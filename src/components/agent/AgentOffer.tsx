import { getTranslations } from "next-intl/server";

const offerKeys = ["networking", "negotiation", "career", "visibility"] as const;

export default async function AgentOffer() {
  const t = await getTranslations("AgentOffer");

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
        {t("eyebrow")}
      </p>
      <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        {t("title")}
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
        {offerKeys.map((key, index) => (
          <div key={key} className="bg-black px-6 py-10">
            <span className="text-xs font-bold tracking-widest text-orange-500">
              0{index + 1}
            </span>
            <h3 className="mt-3 text-lg font-bold text-white">
              {t(`items.${key}.title`)}
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              {t(`items.${key}.description`)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}