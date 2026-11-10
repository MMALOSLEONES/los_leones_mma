
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { adminRequest } from "@/lib/adminFetch";
import {
  demandeStatus,
  isOpenDemande,
  formatDate,
} from "@/lib/labels";

import StatusBadge from "@/components/dashboard/StatusBadge";

import {
  btnPrimary,
  btnOutline,
  btnDanger,
} from "@/components/dashboard/fields";

import type { DemandeApi } from "@/components/types/api";

type Filter = "open" | "approuve" | "refuse" | "all";

const filters: { value: Filter; label: string }[] = [
  { value: "open", label: "À TRAITER" },
  { value: "approuve", label: "APPROUVÉES" },
  { value: "refuse", label: "REFUSÉES" },
  { value: "all", label: "TOUTES" },
];

// --------------------------------------------------
// COMPOSANT DETAIL
// --------------------------------------------------

function Detail({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest text-neutral-500 uppercase">
        {label}
      </p>

      <p className="mt-1 text-sm text-neutral-200">
        {value || "—"}
      </p>
    </div>
  );
}

// --------------------------------------------------
// EXPERIENCE DU CANDIDAT
// --------------------------------------------------

function experienceText(d: DemandeApi) {
  if (!d.a_experience_combat) return "Aucune";

  const parts = [
    d.experience_niveau,
    d.annee_experience != null
      ? `${d.annee_experience} an(s)`
      : null,
  ].filter(Boolean);

  return parts.join(" · ") || "Oui";
}

// --------------------------------------------------
// COMPÉTITIONS DU CANDIDAT
// --------------------------------------------------

function competitionsText(d: DemandeApi) {
  if (!d.a_fait_competitions) return "Aucune";

  return `${d.nombre_combats ?? 0} combat(s) · ${
    d.victoires ?? 0
  }V / ${d.defaites ?? 0}D / ${d.nuls ?? 0}N · ${
    d.kos ?? 0
  } KO · ${d.soumissions ?? 0} soum.`;
}

// --------------------------------------------------
// LISTE DES CANDIDATURES
// --------------------------------------------------

export default function CandidaturesList({
  demandes,
}: {
  demandes: DemandeApi[];
}) {
  const router = useRouter();

  const [filter, setFilter] = useState<Filter>("open");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // Filtrage des candidatures
  const visible = demandes.filter((d) => {
    if (filter === "all") return true;
    if (filter === "open") return isOpenDemande(d.status);

    return d.status === filter;
  });

  // --------------------------------------------------
  // ACTIONS ADMINISTRATEUR
  // --------------------------------------------------

  const run = async (
    id: string,
    action: () => Promise<unknown>,
    confirmMessage: string,
  ) => {
    if (!window.confirm(confirmMessage)) return;

    setBusyId(id);
    setError("");

    try {
      await action();

      // Recharge la liste depuis Laravel
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Action impossible."
      );
    } finally {
      setBusyId(null);
    }
  };

  // Valider une candidature
  const approve = (d: DemandeApi) =>
    run(
      d.id,
      () =>
        adminRequest(
          `/candidatures/${d.id}/promouvoir`,
          "POST"
        ),
      `Valider ${d.prenom} ${d.nom} et l'ajouter aux fighters ?`
    );

  // Refuser une candidature
  const reject = (d: DemandeApi) =>
    run(
      d.id,
      () =>
        adminRequest(`/candidatures/${d.id}`, "PUT", {
          status: "refuse",
        }),
      `Refuser la candidature de ${d.prenom} ${d.nom} ?`
    );

  // Supprimer une candidature
  const remove = (d: DemandeApi) =>
    run(
      d.id,
      () => adminRequest(`/candidatures/${d.id}`, "DELETE"),
      `Supprimer définitivement la candidature de ${d.prenom} ${d.nom} ?`
    );

  // --------------------------------------------------
  // AFFICHAGE
  // --------------------------------------------------

  return (
    <div>
      {/* FILTRES */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold tracking-wide transition ${
              filter === f.value
                ? "border-orange-500 bg-orange-500 text-black"
                : "border-white/20 text-neutral-300 hover:border-white/40"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* MESSAGE D'ERREUR */}
      {error && (
        <div className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* LISTE DES CANDIDATURES */}
      {visible.length === 0 ? (
        <p className="mt-10 text-center text-neutral-500">
          Aucune candidature dans cette catégorie.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((d) => {
            const status = demandeStatus(d.status);
            const busy = busyId === d.id;

            // Séparation des médias par type
            const photos =
              d.media?.filter((m) => m.type === "photo") ?? [];

            const videos =
              d.media?.filter((m) => m.type === "video") ?? [];

            return (
              <li
                key={d.id}
                className="rounded-md border border-white/10 bg-neutral-950"
              >
                {/* EN-TÊTE DE LA CANDIDATURE */}
                <div className="flex flex-wrap items-start justify-between gap-3 p-4">
                  <div>
                    <p className="font-bold text-white">
                      {d.prenom} {d.nom}
                    </p>

                    <p className="mt-1 text-xs text-neutral-500">
                      {d.reference_code ?? "Sans référence"} ·{" "}
                      {d.ville ?? "Ville inconnue"} · reçue le{" "}
                      {formatDate(d.created_at)}
                    </p>
                  </div>

                  <StatusBadge
                    label={status.label}
                    tone={status.tone}
                  />
                </div>

                {/* DOSSIER COMPLET */}
                {expanded === d.id && (
                  <div className="space-y-6 border-t border-white/10 p-4">

                    {/* INFORMATIONS PERSONNELLES */}
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                      <Detail label="TÉLÉPHONE" value={d.tel} />

                      <Detail label="EMAIL" value={d.mail} />

                      <Detail
                        label="NAISSANCE"
                        value={formatDate(d.date_naissance)}
                      />

                      <Detail
                        label="POIDS"
                        value={
                          d.poids_kg != null
                            ? `${d.poids_kg} kg`
                            : null
                        }
                      />

                      <Detail
                        label="CATÉGORIE ESTIMÉE"
                        value={d.categorie_estimee}
                      />

                      <Detail
                        label="EXPÉRIENCE"
                        value={experienceText(d)}
                      />

                      <Detail label="QUARTIER" value={d.quartier} />

                      <Detail
                        label="COMPÉTITIONS"
                        value={competitionsText(d)}
                      />

                      <Detail
                        label="SOURCE"
                        value={d.comment_connu}
                      />
                    </div>

                    {/* MESSAGE DE MOTIVATION */}
                    {d.motivation && (
                      <div className="border-t border-white/5 pt-4">
                        <p className="text-[10px] font-semibold tracking-widest text-neutral-500 uppercase">
                          MOTIVATION
                        </p>

                        <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-neutral-300">
                          {d.motivation}
                        </p>
                      </div>
                    )}

                    {/* MÉDIAS DU CANDIDAT */}
                    {(photos.length > 0 || videos.length > 0) && (
                      <div className="space-y-6 border-t border-white/5 pt-4">

                        {/* PHOTOS */}
                        {photos.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-semibold tracking-widest text-neutral-500 uppercase">
                              Photos chargées ({photos.length})
                            </p>

                            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
                              {photos.map((p) => (
                                <div
                                  key={p.id}
                                  className="relative aspect-[3/4] overflow-hidden rounded-md border border-white/5 bg-neutral-900"
                                >
                                  <img
                                    src={`/api/admin/candidatures/media/${p.id}`}
                                    alt="Média d'inscription"
                                    className="h-full w-full object-cover"
                                  />

                                  {p.position === 0 && (
                                    <span className="absolute bottom-1.5 left-1.5 rounded bg-orange-500 px-1 py-0.5 text-[8px] font-bold text-black uppercase">
                                      Couverture
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* VIDÉOS */}
                        {videos.length > 0 && (
                          <div className="space-y-2">
                            <p className="text-[10px] font-semibold tracking-widest text-neutral-500 uppercase">
                              Vidéos d'entraînement ({videos.length})
                            </p>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                              {videos.map((v, idx) => (
                                <div
                                  key={v.id}
                                  className="space-y-1"
                                >
                                  <p className="text-[10px] font-medium text-neutral-400">
                                    Vidéo #{idx + 1}
                                  </p>

                                  <div className="flex aspect-video items-center justify-center overflow-hidden rounded-md border border-white/5 bg-black">
                                    <video
                                      src={`/api/admin/candidatures/media/${v.id}`}
                                      controls
                                      preload="metadata"
                                      className="h-full w-full object-contain"
                                    />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* ANCIEN FORMAT DE PHOTO */}
                    {photos.length === 0 && d.has_photo && (
                      <div className="border-t border-white/5 pt-4">
                        <p className="text-[10px] font-semibold tracking-widest text-neutral-500 uppercase">
                          PHOTO DE PROFIL (Ancien format)
                        </p>

                        <img
                          src={`/api/admin/candidatures/${d.id}/photo`}
                          alt={`Photo de ${d.prenom} ${d.nom}`}
                          className="mt-2 h-40 w-32 rounded-md border border-white/5 object-cover"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* ACTIONS */}
                <div className="flex flex-wrap items-center gap-2 border-t border-white/5 p-4">

                  {/* OUVRIR / FERMER LE DOSSIER */}
                  <button
                    onClick={() =>
                      setExpanded(
                        expanded === d.id ? null : d.id
                      )
                    }
                    className="text-xs font-semibold text-neutral-400 hover:text-white"
                  >
                    {expanded === d.id
                      ? "Masquer le dossier"
                      : "Voir le dossier"}
                  </button>

                  {/* VALIDATION ET REFUS */}
                  {isOpenDemande(d.status) && (
                    <>
                      <button
                        onClick={() => approve(d)}
                        disabled={busy}
                        className={btnPrimary}
                      >
                        {busy ? "EN COURS..." : "VALIDER"}
                      </button>

                      <button
                        onClick={() => reject(d)}
                        disabled={busy}
                        className={btnOutline}
                      >
                        REFUSER
                      </button>
                    </>
                  )}

                  {/* SUPPRESSION */}
                  <button
                    onClick={() => remove(d)}
                    disabled={busy}
                    className={btnDanger}
                  >
                    SUPPRIMER
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
