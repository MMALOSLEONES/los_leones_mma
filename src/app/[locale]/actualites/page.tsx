import { getTranslations } from "next-intl/server";
import { getArticles } from "@/lib/public-api";
import FeaturedArticle from "@/components/actualites/FeaturedArticle";
import ArticleCard from "@/components/actualites/ArticleCard";

export default async function ActualitesPage() {
  const t = await getTranslations("ActualitesPage");
  const articles = await getArticles();
  const [featured, ...rest] = articles;

  return (
    <main>
      <section className="border-b border-white/10 bg-neutral-950 px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
            {t("title")}
          </h1>
          <p className="mt-4 text-neutral-400">{t("description")}</p>
        </div>
      </section>

      {!featured ? (
        <p className="px-4 py-24 text-center text-neutral-500">{t("empty")}</p>
      ) : (
        <>
          <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
            <FeaturedArticle article={featured} />
          </section>

          {rest.length > 0 && (
            <section className="mx-auto max-w-7xl border-t border-white/10 px-4 py-16 lg:px-8">
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((article) => (
                  <ArticleCard key={article.id} article={article} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </main>
  );
}