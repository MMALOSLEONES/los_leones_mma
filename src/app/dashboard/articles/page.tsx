import { apiGet, unwrap } from "@/lib/api";
import PageTitle from "@/components/dashboard/PageTitle";
import ArticlesManager from "@/components/dashboard/ArticlesManager";
import type { ApiList, ArticleApi } from "@/components/types/api";

export default async function ArticlesPage() {
  const articles = unwrap(await apiGet<ApiList<ArticleApi>>("/admin/articles"));

  return (
    <div>
      <PageTitle
        eyebrow="ARTICLES"
        title="LE FIL LEONES"
        description="Un brouillon reste invisible tant qu'il n'est pas publié."
      />
      <ArticlesManager articles={articles} />
    </div>
  );
}
