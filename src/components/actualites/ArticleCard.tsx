import Link from "next/link";
import { Article } from "@/components/types/article";

export default function ArticleCard({
  article,
}: {
  article: Article;
}) {
  return (
    <Link
      href={`/actualites/${article.slug}`}
      className="group block overflow-hidden border border-neutral-800 bg-neutral-900/40 transition duration-300 hover:border-neutral-700"
    >
      {/* Image */}
      <div className="aspect-[16/9] w-full overflow-hidden bg-neutral-900">
        {article.photos[0] && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.photos[0]}
            alt={article.title}
            className="h-full w-full object-cover grayscale transition duration-500 group-hover:scale-105 group-hover:grayscale-0"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-orange-500">
          {article.category}
        </p>

        <h3 className="mt-3 text-base font-bold leading-snug text-white transition group-hover:text-orange-400 sm:text-lg">
          {article.title}
        </h3>

        <p className="mt-3 text-xs leading-relaxed text-neutral-400 sm:text-sm">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}