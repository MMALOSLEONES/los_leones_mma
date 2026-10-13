import Link from "next/link";
import { apiGet, unwrap } from "@/lib/api";
import { demandeStatus, formatDate, isOpenDemande } from "@/lib/labels";
import StatusBadge from "@/components/dashboard/StatusBadge";
import PageTitle from "@/components/dashboard/PageTitle";
import type {
  ApiList,
  ArticleApi,
  DemandeApi,
  FighterApi,
} from "@/components/types/api";

export default async function DashboardHome() {
  const [demandes, fighters, articles] = await Promise.all([
    apiGet<ApiList<DemandeApi>>("/admin/candidatures").then((p) => unwrap(p)),
    apiGet<ApiList<FighterApi>>("/admin/fighters").then((p) => unwrap(p)),
    apiGet<ApiList<ArticleApi>>("/admin/articles").then((p) => unwrap(p)),
  ]);

  const toProcess = demandes.filter((d) => isOpenDemande(d.status));
  const latest = [...toProcess]
    .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
    .slice(0, 5);

  const stats = [
    { label: "CANDIDATURES À TRAITER", value: toProcess.length, href: "/dashboard/candidatures" },
    { label: "CANDIDATURES AU TOTAL", value: demandes.length, href: "/dashboard/candidatures" },
    { label: "FIGHTERS", value: fighters.length, href: "/dashboard/fighters" },
    { label: "ARTICLES", value: articles.length, href: "/dashboard/articles" },
  ];

  return (
    <div>
      <PageTitle
        eyebrow="VUE D'ENSEMBLE"
        title="L'AGENCE EN UN COUP D'ŒIL"
      />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-md border border-white/10 bg-neutral-950 p-5 transition hover:border-white/30"
          >
            <p className="text-[10px] font-semibold tracking-widest text-neutral-500">
              {stat.label}
            </p>
            <p className="mt-2 text-3xl font-extrabold text-orange-500">
              {stat.value}
            </p>
          </Link>
        ))}
      </div>

      <h2 className="mt-12 text-xs font-bold tracking-widest text-orange-500">
        DERNIÈRES CANDIDATURES À TRAITER
      </h2>
      {latest.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">
          Rien à traiter pour le moment.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-white/10 rounded-md border border-white/10 bg-neutral-950">
          {latest.map((d) => {
            const status = demandeStatus(d.status);
            return (
              <li key={d.id} className="flex items-center justify-between gap-3 p-4">
                <div>
                  <p className="font-bold text-white">
                    {d.prenom} {d.nom}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    Reçue le {formatDate(d.created_at)}
                  </p>
                </div>
                <StatusBadge label={status.label} tone={status.tone} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
