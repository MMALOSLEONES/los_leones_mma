import Link from "next/link";
import { Fighter } from "@/components/types/fighter";

export default function FighterHero({ fighter }: { fighter: Fighter }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-10 lg:px-8">
      <Link
        href="/fighters"
        className="text-xs font-semibold tracking-widest text-orange-500 hover:text-orange-400"
      >
        ‹ RETOUR AUX FIGHTERS
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]">
        {/* Photo */}
        <div className="aspect-[3/4] w-full max-w-sm rounded-md bg-[linear-gradient(160deg,#3a3a3a,#0a0a0a)]" />

        {/* Infos */}
        <div>
          <div className="flex flex-wrap gap-2">
            <span className="rounded bg-orange-500 px-2 py-1 text-[10px] font-bold tracking-widest text-black">
              {fighter.discipline}
            </span>
            <span className="rounded border border-white/20 px-2 py-1 text-[10px] font-bold tracking-widest text-neutral-300">
              {fighter.tier.toUpperCase()}
            </span>
          </div>

          {fighter.nickname && (
            <p className="mt-4 text-sm font-semibold italic text-orange-500">
              &quot;{fighter.nickname}&quot;
            </p>
          )}
          <h1 className="mt-1 text-4xl font-extrabold text-white sm:text-5xl">
            {fighter.fullName}
          </h1>

          <p className="mt-4 text-sm text-neutral-400">
            {fighter.weightCategory} — {fighter.weightKg} KG
          </p>

          {fighter.instagram && (
            <a
              href={fighter.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 rounded-md border border-white/20 px-4 py-2 text-xs font-semibold tracking-wide text-white hover:border-white/40"
            >
              INSTAGRAM
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
