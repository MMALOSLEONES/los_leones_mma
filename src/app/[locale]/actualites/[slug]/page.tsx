import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getArticle } from "@/lib/public-api";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const t = await getTranslations("ArticlePage");
  const article = await getArticle(slug);
  const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "";

  if (!article) {
    notFound();
  }

  const photos = (article.photos ?? []).map(toUrl).filter(Boolean);
  const [cover, ...others] = photos;

  function toUrl(p: unknown): string {
    const raw =
      typeof p === "string"
        ? p
        : ((p as { url?: string; path?: string })?.url ??
          (p as { path?: string })?.path ??
          "");
    if (!raw) return "";
    if (raw.startsWith("http")) return raw;
    return `${API_BASE}${raw.startsWith("/") ? "" : "/"}${raw}`;
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <Link
        href="/actualites"
        className="text-xs font-semibold tracking-widest text-orange-500 hover:text-orange-400"
      >
        {t("back")}
      </Link>

      <p className="mt-6 text-xs font-bold tracking-widest text-orange-500">
        {article.category.toUpperCase()} — {article.date}
      </p>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
        {article.title}
      </h1>

      {cover && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={cover}
          alt={article.title}
          className="mt-8 h-auto max-h-[70vh] w-full rounded-md bg-black object-contain"
        />
      )}

      <div className="mt-8 space-y-4 text-neutral-300">
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>

      {others.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xs font-bold tracking-widest text-orange-500">
            GALERIE
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {others.map((url, i) => (
              <a
                key={`${url}-${i}`}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${article.title} — photo ${i + 2}`}
                  className="aspect-[4/3] w-full object-cover transition hover:opacity-90"
                />
              </a>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
