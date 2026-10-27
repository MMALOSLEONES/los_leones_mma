"use client";

import { useMemo, useState } from "react";
import type {
  Fighter,
  WeightCategory,
  FighterTier,
} from "@/components/types/fighter";
import FighterFilters from "@/components/fighters/FighterFilters";
import FighterCard from "@/components/fighters/FighterCard";

// Ancienne logique de la page /fighters : les filtres ont besoin d'état (useState),
// donc ils vivent dans un composant client. La page, elle, charge les données côté serveur.
export default function FightersExplorer({ fighters }: { fighters: Fighter[] }) {
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
        FIGHTERS
      </h1>
      <p className="mt-3 max-w-xl text-neutral-400">
        Les combattants représentés par l&apos;agence.
      </p>

      {fighters.length === 0 ? (
        <p className="mt-16 text-center text-neutral-500">
          Le roster arrive bientôt.
        </p>
      ) : (
        <>
          <div className="mt-10">
            <FighterFilters
              selectedCategory={category}
              onCategoryChange={setCategory}
              selectedTier={tier}
              onTierChange={setTier}
              resultCount={filteredFighters.length}
            />
          </div>

          {filteredFighters.length === 0 ? (
            <p className="mt-16 text-center text-neutral-500">
              Aucun fighter ne correspond à ces filtres.
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
