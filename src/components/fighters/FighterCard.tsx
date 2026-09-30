import Link from "next/link";
import { Fighter } from "@/components/types/fighter";

export default function FighterCard({ fighter }: { fighter: Fighter }) {
  return (
    <Link
      href={`/fighters/${fighter.slug}`}
      className="group block overflow-hidden rounded-md bg-neutral-900"
    >
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[linear-gradient(160deg,#3a3a3a,#0a0a0a)]">
        <span className="absolute left-3 top-3 rounded bg-orange-500 px-2 py-1 text-[10px] font-bold tracking-widest text-black">
          {fighter.discipline}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent transition duration-300 group-hover:scale-105" />
      </div>

      <div className="p-4">
        {fighter.nickname && (
          <p className="text-xs font-semibold italic tracking-wide text-orange-500">
            &quot;{fighter.nickname}&quot;
          </p>
        )}
        <h3 className="mt-1 text-lg font-bold text-white">
          {fighter.fullName}
        </h3>
        <p className="mt-1 text-sm text-neutral-400">
          {fighter.weightCategory} — {fighter.weightKg} KG
        </p>

        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-neutral-200">
            {fighter.record.wins}-{fighter.record.losses}-{fighter.record.draws}
          </p>
          <span className="text-xs font-bold tracking-widest text-orange-500 group-hover:text-orange-400">
            VOIR LE PROFIL »
          </span>
        </div>
      </div>
    </Link>
  );
}