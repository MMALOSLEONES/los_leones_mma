import Link from "next/link";
import { getArticles } from "@/lib/public-api";
import ArticleCard from "@/components/actualites/ArticleCard";

export default async function NewsSection() {
  const articles = (await getArticles()).slice(0, 3);

  // Ne pas afficher de section vide
  if (articles.length === 0) return null;

  return (
    <section className="bg-neutral-950 py-20 lg:py-24">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-orange-500" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-500">
                Actualités
              </span>
            </div>

            <h2 className="text-4xl font-extrabold uppercase text-white sm:text-5xl">
              La vie de l'agence
            </h2>
          </div>

          <Link
            href="/actualites"
            className="hidden border border-neutral-800 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-white transition hover:border-neutral-600 sm:block"
          >
            Toutes les actus
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>

        <div className="mt-6 sm:hidden">
          <Link
            href="/actualites"
            className="text-xs font-bold uppercase tracking-widest text-white"
          >
            Toutes les actus →
          </Link>
        </div>
      </div>
    </section>
  );
}