import { getTranslations } from "next-intl/server";

const typeKeys = ["sponsoring", "fights", "gyms", "media"] as const;
const bulletKeys = ["bullet1", "bullet2"] as const;

export default async function PartnershipTypes() {
  const t = await getTranslations("PartnershipTypes");

  return (
    <section className="border-t border-white/10 bg-neutral-950 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
          {t("eyebrow")}
        </p>
        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          {t("title")}
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {typeKeys.map((key, index) => (
            <div
              key={key}
              className="rounded-md border border-white/10 bg-black p-6"
            >
              <span className="text-xs font-bold tracking-widest text-orange-500">
                0{index + 1}
              </span>
              <h3 className="mt-2 text-lg font-bold text-white">
                {t(`items.${key}.title`)}
              </h3>
              <ul className="mt-4 space-y-2">
                {bulletKeys.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-sm text-neutral-400"
                  >
                    <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-orange-500" />
                    {t(`items.${key}.${bullet}`)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}