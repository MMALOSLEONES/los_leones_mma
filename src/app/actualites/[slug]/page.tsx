import { notFound } from "next/navigation";
import Link from "next/link";
import { mockArticles } from "@/components/data/mock-articles";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  const article = mockArticles.find((a) => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <Link
        href="/actualites"
        className="text-xs font-semibold tracking-widest text-orange-500 hover:text-orange-400"
      >
        ‹ RETOUR AU FIL LEONES
      </Link>

      <p className="mt-6 text-xs font-bold tracking-widest text-orange-500">
        {article.category.toUpperCase()} — {article.date}
      </p>
      <h1 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-5xl">
        {article.title}
      </h1>

      <div className="mt-8 aspect-[16/9] w-full rounded-md bg-[linear-gradient(160deg,#3a3a3a,#0a0a0a)]" />

      <div className="mt-8 space-y-4 text-neutral-300">
        {article.content.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
    </main>
  );
}
