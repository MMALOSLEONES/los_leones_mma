"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminRequest } from "@/lib/adminFetch";
import { demandeStatus, isOpenDemande, formatDate } from "@/lib/labels";
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

function Detail({ label, value }: { label: string; value?: string | null }) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest text-neutral-500">
        {label}
      </p>
      <p className="mt-1 text-sm text-neutral-200">{value || "—"}</p>
    </div>
  );
}

function experienceText(d: DemandeApi) {
  if (!d.a_experience_combat) return "Aucune";
  const parts = [
    d.experience_niveau,
    d.annee_experience != null ? `${d.annee_experience} an(s)` : null,
  ].filter(Boolean);
  return parts.join(" · ") || "Oui";
}

function competitionsText(d: DemandeApi) {
  if (!d.a_fait_competitions) return "Aucune";
  return `${d.nombre_combats ?? 0} combat(s) · ${d.victoires ?? 0}V / ${d.defaites ?? 0}D / ${d.nuls ?? 0}N · ${d.kos ?? 0} KO · ${d.soumissions ?? 0} soum.`;
}

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

  const visible = demandes.filter((d) => {
    if (filter === "all") return true;
    if (filter === "open") return isOpenDemande(d.status);
    return d.status === filter;
  });

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
      router.refresh(); // recharge la liste depuis Laravel
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible.");
    } finally {
      setBusyId(null);
    }
  };

  const approve = (d: DemandeApi) =>
    run(
      d.id,
      () => adminRequest(`/candidatures/${d.id}/promouvoir`, "POST"),
      `Valider ${d.prenom} ${d.nom} et l'ajouter aux fighters ?`,
    );

  const reject = (d: DemandeApi) =>
    run(
      d.id,
      () => adminRequest(`/candidatures/${d.id}`, "PUT", { status: "refuse" }),
      `Refuser la candidature de ${d.prenom} ${d.nom} ?`,
    );

  const remove = (d: DemandeApi) =>
    run(
      d.id,
      () => adminRequest(`/candidatures/${d.id}`, "DELETE"),
      `Supprimer définitivement la candidature de ${d.prenom} ${d.nom} ?`,
    );

  return (
    <div>
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

      {error && (
        <div className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {visible.length === 0 ? (
        <p className="mt-10 text-center text-neutral-500">
          Aucune candidature dans cette catégorie.
        </p>
      ) : (
        <ul className="mt-6 space-y-3">
          {visible.map((d) => {
            const status = demandeStatus(d.status);
            const busy = busyId === d.id;
            return (
              <li
                key={d.id}
                className="rounded-md border border-white/10 bg-neutral-950"
              >
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
                  <StatusBadge label={status.label} tone={status.tone} />
                </div>

                {expanded === d.id && (
                  <div className="grid grid-cols-1 gap-4 border-t border-white/10 p-4 sm:grid-cols-2 lg:grid-cols-3">
                    <Detail label="TÉLÉPHONE" value={d.tel} />
                    <Detail label="EMAIL" value={d.mail} />
                    <Detail
                      label="NAISSANCE"
                      value={formatDate(d.date_naissance)}
                    />
                    <Detail label="EXPÉRIENCE" value={experienceText(d)} />
                    <Detail label="QUARTIER" value={d.quartier} />
                    <Detail label="COMPÉTITIONS" value={competitionsText(d)} />
                    <Detail label="SOURCE" value={d.comment_connu} />
                    {d.has_photo && (
                      <div>
                        <p className="text-[10px] font-semibold tracking-widest text-neutral-500">
                          PHOTO
                        </p>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={`/api/admin/candidatures/${d.id}/photo`}
                          alt={`Photo de ${d.prenom} ${d.nom}`}
                          className="mt-1 h-40 w-32 rounded-md object-cover"
                        />
                      </div>
                    )}
                    {d.motivation && (
                      <div className="sm:col-span-2 lg:col-span-3">
                        <Detail label="MOTIVATION" value={d.motivation} />
                      </div>
                    )}
                  </div>
                )}

                <div className="flex flex-wrap items-center gap-2 border-t border-white/10 p-4">
                  <button
                    onClick={() => setExpanded(expanded === d.id ? null : d.id)}
                    className="text-xs font-semibold text-neutral-400 hover:text-white"
                  >
                    {expanded === d.id
                      ? "Masquer le dossier"
                      : "Voir le dossier"}
                  </button>
                  <span className="flex-1" />
                  {isOpenDemande(d.status) && (
                    <>
                      <button
                        onClick={() => approve(d)}
                        disabled={busy}
                        className={btnPrimary}
                      >
                        VALIDER
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
                  <button
                    onClick={() => remove(d)}
                    disabled={busy}
                    className={btnDanger}
                  >
                    Supprimer
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
