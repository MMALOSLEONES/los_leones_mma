"use client";

import { useTranslations } from "next-intl"; // S'adapte selon votre package (ex: next-intl)
import Link from "next/link";
import type { Fighter } from "@/components/types/fighter";

export default function FighterCard({ fighter }: { fighter: Fighter }) {
  const tCat = useTranslations("categories");

  return (
    <div className="overflow-hidden rounded-xl border border-white/10 bg-neutral-900/50 transition hover:border-white/20">
      {/* Conteneur de l'image / placeholder */}
      <div className="relative aspect-[4/3] w-full bg-gradient-to-br from-orange-500/20 to-neutral-800 flex items-center justify-center">
        {fighter.photoUrl ? (
          <img
            src={fighter.photoUrl}
            alt={fighter.fullName}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-6xl text-orange-500/40">?</div>
        )}
      </div>

      {/* Informations du combattant */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-white tracking-wide">
          {fighter.fullName}
        </h3>
        
        {/* Traduction dynamique de la catégorie de poids */}
        <p className="mt-1 text-xs font-medium text-neutral-400">
          {tCat(fighter.weightCategory)} — {fighter.weightKg} KG
        </p>

        {/* Fiche de statistiques rapides (Record) */}
        <div className="mt-4 flex items-center gap-4 text-sm font-semibold text-white">
          <span>
            {fighter.record.wins}-{fighter.record.losses}-{fighter.record.draws}
          </span>
          <span className="text-xs font-normal text-neutral-500">
            ({fighter.tier})
          </span>
        </div>

        {/* Bouton de redirection vers le profil */}
        <div className="mt-5 flex justify-end">
          <Link
            href={`/fighters/${fighter.slug}`}
            className="text-xs font-bold uppercase tracking-wider text-orange-500 hover:text-orange-400 flex items-center gap-1 transition"
          >
            Voir le profil <span className="text-sm">»</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
