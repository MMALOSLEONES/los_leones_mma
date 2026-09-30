import Link from "next/link";
import { Article } from "@/components/types/article";

export default function FeaturedArticle({ article }: { article: Article }) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-center"
    >
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-[linear-gradient(160deg,#3a3a3a,#0a0a0a)] transition duration-300 group-hover:opacity-90 lg:aspect-[16/11]" />

      <div>
        <p className="text-xs font-bold tracking-widest text-orange-500">
          {article.category.toUpperCase()} — {article.date}
        </p>
        <h2 className="mt-3 text-2xl font-extrabold leading-tight text-white sm:text-3xl">
          {article.title}
        </h2>
        <p className="mt-4 text-neutral-400">{article.excerpt}</p>
        <span className="mt-6 inline-block text-xs font-bold tracking-widest text-orange-500 group-hover:text-orange-400">
          LIRE L&apos;ARTICLE →
        </span>
      </div>
    </Link>
  );
}
