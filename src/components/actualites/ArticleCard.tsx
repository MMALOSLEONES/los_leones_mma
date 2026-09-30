import Link from "next/link";
import { Article } from "@/components/types/article";

export default function ArticleCard({ article }: { article: Article }) {
  return (
    <Link href={`/actualites/${article.slug}`} className="group block">
      <div className="aspect-[4/3] w-full overflow-hidden rounded-md bg-[linear-gradient(160deg,#3a3a3a,#0a0a0a)] transition duration-300 group-hover:opacity-90" />
      <div className="mt-4">
        <p className="text-xs font-bold tracking-widest text-orange-500">
          {article.category.toUpperCase()} — {article.date}
        </p>
        <h3 className="mt-2 text-lg font-bold leading-snug text-white group-hover:text-orange-400">
          {article.title}
        </h3>
        <p className="mt-2 text-sm text-neutral-400">{article.excerpt}</p>
      </div>
    </Link>
  );
}
