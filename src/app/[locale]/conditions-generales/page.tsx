import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

const sectionKeys = [
  "presentation",
  "candidature",
  "fees",
  "validation",
  "integration",
  "payment",
  "data",
  "claims",
  "acceptance",
] as const;

export default async function ConditionsPage() {
  const t = await getTranslations("ConditionsPage");

  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <header className="border-b border-neutral-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 lg:px-8">
          <Link
            href="/"
            className="text-lg font-extrabold uppercase tracking-tight"
          >
            MMA <span className="text-orange-500">LOS LEONES</span>
          </Link>

          <Link
            href="/"
            className="text-xs font-semibold uppercase tracking-wider text-neutral-400 transition-colors hover:text-orange-500"
          >
            {t("back")}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b border-neutral-800">
        <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-6 bg-orange-500" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-500">
              {t("eyebrow")}
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl font-extrabold uppercase leading-[1.05] tracking-tight sm:text-5xl lg:text-7xl">
            {t("title")}
            <span className="block text-orange-500">{t("titleAccent")}</span>
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
            {t("description")}
          </p>

          <p className="mt-8 text-[10px] font-semibold uppercase tracking-widest text-neutral-600">
            {t("updated")}
          </p>
        </div>
      </section>

      {/* Registration fee */}
      <section className="border-b border-neutral-800">
        <div className="mx-auto grid max-w-7xl gap-8 px-4 py-14 lg:grid-cols-2 lg:items-center lg:px-8">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-orange-500" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-500">
                {t("feeEyebrow")}
              </span>
            </div>

            <h2 className="text-3xl font-extrabold uppercase tracking-tight">
              {t("feeTitle")}
            </h2>

            <p className="mt-4 max-w-lg text-sm leading-relaxed text-neutral-400">
              {t("feeDescription")}
            </p>
          </div>

          <div className="border border-neutral-800 bg-black/40 p-7 lg:p-9">
            <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-neutral-500">
              {t("amountLabel")}
            </p>

            <p className="mt-3 text-5xl font-extrabold tracking-tight">
              10 000 <span className="text-xl text-orange-500">FCFA</span>
            </p>

            <div className="my-6 h-px bg-neutral-800" />

            <p className="text-xs leading-relaxed text-neutral-400">
              {t("feeNotice")}
            </p>
          </div>
        </div>
      </section>

      {/* Conditions */}
      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-6 bg-orange-500" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-500">
              {t("rulesEyebrow")}
            </span>
          </div>

          <h2 className="text-3xl font-extrabold uppercase tracking-tight sm:text-4xl">
            {t("rulesTitle")}
          </h2>
        </div>

        <div className="divide-y divide-neutral-800 border-t border-neutral-800">
          {sectionKeys.map((key, index) => (
            <article
              key={key}
              className="grid gap-5 py-8 md:grid-cols-[90px_1fr] md:gap-10"
            >
              <span className="text-2xl font-bold text-orange-500">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div>
                <h3 className="text-base font-extrabold uppercase tracking-wide sm:text-lg">
                  {t(`sections.${key}.title`)}
                </h3>

                <p className="mt-4 max-w-3xl text-sm leading-7 text-neutral-400">
                  {t(`sections.${key}.content`)}
                </p>

                {key !== "presentation" && t.has(`sections.${key}.extra`) && (
                  <p className="mt-3 max-w-3xl text-sm leading-7 text-neutral-400">
                    {t(`sections.${key}.extra`)}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-orange-500">
        <div className="mx-auto max-w-7xl px-4 py-14 lg:px-8 lg:py-20">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/60">
            MMA Los Leones
          </p>

          <h2 className="mt-5 max-w-3xl text-3xl font-extrabold uppercase leading-tight text-black sm:text-4xl lg:text-5xl">
            {t("closingTitle")}
          </h2>

          <p className="mt-5 max-w-xl text-sm leading-relaxed text-black/70">
            {t("closingDescription")}
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex border border-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-black hover:text-white"
          >
            {t("back")}
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-neutral-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-7 text-[10px] uppercase tracking-wider text-neutral-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <span className="font-bold">MMA LOS LEONES</span>
          <span>{t("copyright", { year: new Date().getFullYear() })}</span>
        </div>
      </footer>
    </main>
  );
}
