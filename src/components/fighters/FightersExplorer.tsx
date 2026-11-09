"use client";

import { useMemo, useState } from "react";
import { useTranslations } from "next-intl"; // S'adapte selon votre package (ex: next-intl)
import type {
  Fighter,
  WeightCategory,
  FighterTier,
} from "@/components/types/fighter";
import FighterFilters from "@/components/fighters/FighterFilters";
import FighterCard from "@/components/fighters/FighterCard";

export default function FightersExplorer({ fighters }: { fighters: Fighter[] }) {
  const t = useTranslations("fighters");
  const tCat = useTranslations("categories");

  const [category, setCategory] = useState<WeightCategory | "Tous">("Tous");
  const [tier, setTier] = useState<FighterTier | "Tous">("Tous");

  const filteredFighters = useMemo(() => {
    return fighters.filter((fighter) => {
      const matchCategory =
        category === "Tous" || fighter.weightCategory === category;
      const matchTier = tier === "Tous" || fighter.tier === tier;
      return matchCategory && matchTier;
    });
  }, [fighters, category, tier]);

  return (
    <main className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
        LOS LEONES
      </p>
      <h1 className="mt-3 text-4xl font-extrabold text-white sm:text-5xl">
        {t("title")}
      </h1>
      <p className="mt-3 max-w-xl text-neutral-400">
        {t("subtitle")}
      </p>

      {fighters.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">
          {t("soon")}
        </p>
      ) : (
        <>
          <div className="mt-10">
            {/* On transmet ici la fonction tCat pour que les boutons s'affichent en français */}
            <FighterFilters
              selectedCategory={category}
              onCategoryChange={setCategory}
              selectedTier={tier}
              onTierChange={setTier}
              resultCount={filteredFighters.length}
              tCat={tCat} 
            />
          </div>

          {filteredFighters.length === 0 ? (
            <p className="mt-16 text-center text-neutral-500">
              {t("no_results")}
            </p>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredFighters.map((fighter) => (
                <FighterCard key={fighter.id} fighter={fighter} />
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
