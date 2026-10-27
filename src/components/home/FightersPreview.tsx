import { getTranslations } from "next-intl/server";
import { getFighters } from "@/lib/public-api";
import FighterCard from "@/components/fighters/FighterCard";
import Button from "@/components/ui/Button";

export default async function FightersPreview() {
  const t = await getTranslations("FightersPreview");
  const fighters = (await getFighters()).slice(0, 4);

  if (fighters.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-2 text-neutral-400">{t("subtitle")}</p>
        </div>
        <Button href="/fighters" variant="outline" className="w-fit">
          {t("viewAll")}
        </Button>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {fighters.map((fighter) => (
          <FighterCard key={fighter.id} fighter={fighter} />
        ))}
      </div>
    </section>
  );
}