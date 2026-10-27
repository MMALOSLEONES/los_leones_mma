import { getTranslations } from "next-intl/server";

const keys = [
  "important", "camp", "important", "camp", "important",
  "important", "camp", "important", "camp", "important",
] as const;

export default async function AnnouncementBar() {
  const t = await getTranslations("AnnouncementBar");
  const announcements = keys.map((key) => t(key));

  return (
    <section
      aria-label={t("ariaLabel")}
      className="overflow-hidden border-y border-black/20 bg-orange-500 py-4"
    >
      <div className="flex w-max animate-marquee">
        {[...announcements, ...announcements].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-8 px-4"
          >
            <span className="whitespace-nowrap text-xs font-black uppercase tracking-[0.2em] text-black sm:text-sm">
              {item}
            </span>
            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rotate-45 bg-black"
            />
          </div>
        ))}
      </div>
    </section>
  );
}