import { apiGet, unwrap } from "@/lib/api";
import PageTitle from "@/components/dashboard/PageTitle";
import CandidaturesList from "@/components/dashboard/CandidaturesList";
import type { ApiList, DemandeApi } from "@/components/types/api";

export default async function CandidaturesPage() {
  const demandes = unwrap(
    await apiGet<ApiList<DemandeApi>>("/admin/candidatures")
  );

  return (
    <div>
      <PageTitle
        eyebrow="CANDIDATURES"
        title="DOSSIERS REÇUS"
        description="Valider ajoute le candidat aux fighters du site."
      />
      <CandidaturesList demandes={demandes} />
    </div>
  );
}
