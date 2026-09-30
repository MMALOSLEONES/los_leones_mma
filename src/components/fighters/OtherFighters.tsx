import { Fighter } from "@/components/types/fighter";
import FighterCard from "@/components/fighters/FighterCard";

export default function OtherFighters({
  fighters,
}: {
  fighters: Fighter[];
}) {
  if (fighters.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
        DÉCOUVRIR
      </p>
      <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
        AUTRES FIGHTERS
      </h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {fighters.map((fighter) => (
          <FighterCard key={fighter.id} fighter={fighter} />
        ))}
      </div>
    </section>
  );
}
