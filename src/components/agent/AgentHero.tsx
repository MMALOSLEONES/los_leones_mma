import { getTranslations } from "next-intl/server";

export default async function AgentHero() {
  const t = await getTranslations("AgentHero");

  return (
    <section className="border-b border-white/10 bg-neutral-950 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-6xl">
          SIDY NDIAYE
        </h1>
        <p className="mt-2 text-sm font-semibold tracking-wide text-neutral-400">
          {t("role")}
        </p>

        <div className="mt-8 space-y-4 text-neutral-400">
          <p>{t("p1")}</p>
          <p>{t("p2")}</p>
          <p>{t("p3")}</p>
        </div>
      </div>
    </section>
  );
}