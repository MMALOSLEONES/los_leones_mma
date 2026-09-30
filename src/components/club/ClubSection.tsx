type ClubSectionProps = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  reverse?: boolean;
};

export default function ClubSection({
  eyebrow,
  title,
  paragraphs,
  reverse = false,
}: ClubSectionProps) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div
        className={`grid grid-cols-1 items-center gap-12 lg:grid-cols-2 ${
          reverse ? "lg:[&>*:first-child]:order-2" : ""
        }`}
      >
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
            {eyebrow}
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            {title}
          </h2>
          <div className="mt-6 space-y-4">
            {paragraphs.map((paragraph, i) => (
              <p key={i} className="text-neutral-400">
                {paragraph}
              </p>
            ))}
          </div>
        </div>

        {/* Placeholder image éditoriale */}
        <div className="aspect-[4/5] w-full rounded-md bg-[linear-gradient(160deg,#1a1a1a,#0a0a0a)]" />
      </div>
    </section>
  );
}
