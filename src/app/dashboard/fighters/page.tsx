import { apiGet, unwrap } from "@/lib/api";
import PageTitle from "@/components/dashboard/PageTitle";
import FightersManager from "@/components/dashboard/FightersManager";
import type { ApiList, FighterApi } from "@/components/types/api";

export default async function FightersPage() {
  const fighters = unwrap(await apiGet<ApiList<FighterApi>>("/admin/fighters"));

  return (
    <div>
      <PageTitle
        eyebrow="FIGHTERS"
        title="LE ROSTER"
        description="Ajoute un fighter directement, ou supprime-le du site."
      />
      <FightersManager fighters={fighters} />
    </div>
  );
}
