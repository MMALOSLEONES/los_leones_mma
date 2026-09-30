import { mockArticles } from "@/components/data/mock-articles";
import FeaturedArticle from "@/components/actualites/FeaturedArticle";
import ArticleCard from "@/components/actualites/ArticleCard";

export default function ActualitesPage() {
  const [featured, ...rest] = mockArticles;

  return (
    <main>
      <section className="border-b border-white/10 bg-neutral-950 px-4 py-20 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold text-white sm:text-6xl">
            LE FIL LEONES
          </h1>
          <p className="mt-4 text-neutral-400">
            Combats, événements, coulisses : ce que vivent nos fighters.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <FeaturedArticle article={featured} />
      </section>

      <section className="mx-auto max-w-7xl border-t border-white/10 px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      </section>
    </main>
  );
}
