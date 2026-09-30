"use client";

import { WeightCategory, FighterTier } from "@/components/types/fighter";

const categories: WeightCategory[] = [
  "Flyweight",
  "Bantamweight",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Light Heavyweight",
  "Heavyweight",
];

const tiers: FighterTier[] = ["Professionnel", "Semi-Pro", "Amateur"];

type FighterFiltersProps = {
  selectedCategory: WeightCategory | "Tous";
  onCategoryChange: (value: WeightCategory | "Tous") => void;
  selectedTier: FighterTier | "Tous";
  onTierChange: (value: FighterTier | "Tous") => void;
  resultCount: number;
};

function FilterPill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition ${
        active
          ? "border-orange-500 bg-orange-500 text-black"
          : "border-white/20 text-neutral-300 hover:border-white/40"
      }`}
    >
      {children}
    </button>
  );
}

export default function FighterFilters({
  selectedCategory,
  onCategoryChange,
  selectedTier,
  onTierChange,
  resultCount,
}: FighterFiltersProps) {
  return (
    <div className="border-b border-white/10 pb-8">
      <div>
        <p className="text-xs font-semibold tracking-widest text-neutral-500">
          CATÉGORIE
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterPill
            active={selectedCategory === "Tous"}
            onClick={() => onCategoryChange("Tous")}
          >
            TOUS
          </FilterPill>
          {categories.map((category) => (
            <FilterPill
              key={category}
              active={selectedCategory === category}
              onClick={() => onCategoryChange(category)}
            >
              {category.toUpperCase()}
            </FilterPill>
          ))}
        </div>
      </div>

      <div className="mt-6">
        <p className="text-xs font-semibold tracking-widest text-neutral-500">
          NIVEAU
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          <FilterPill
            active={selectedTier === "Tous"}
            onClick={() => onTierChange("Tous")}
          >
            TOUS
          </FilterPill>
          {tiers.map((tier) => (
            <FilterPill
              key={tier}
              active={selectedTier === tier}
              onClick={() => onTierChange(tier)}
            >
              {tier.toUpperCase()}
            </FilterPill>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-neutral-500">
        {resultCount} FIGHTER{resultCount > 1 ? "S" : ""}
      </p>
    </div>
  );
}
