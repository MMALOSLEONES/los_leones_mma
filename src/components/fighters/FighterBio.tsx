import { Fighter } from "@/components/types/fighter";

export default function FighterBio({ fighter }: { fighter: Fighter }) {
  return (
    <div>
      <h2 className="text-xs font-bold tracking-widest text-orange-500">
        À PROPOS
      </h2>
      <p className="mt-3 text-neutral-400">{fighter.bio}</p>

      <h2 className="mt-8 text-xs font-bold tracking-widest text-orange-500">
        STYLE DE COMBAT
      </h2>
      <p className="mt-3 text-neutral-400">{fighter.fightingStyle}</p>
    </div>
  );
}
