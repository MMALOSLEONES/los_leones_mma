import Image from "next/image";

type ClubSectionProps = {
  eyebrow: string;
  title: string;
  paragraphs: string[];
  imageSrc: string; // <-- Nouvelle prop obligatoire
  imageAlt?: string; // <-- Nouvelle prop optionnelle pour le SEO/Accessibilité
  reverse?: boolean;
};

export default function ClubSection({
  eyebrow,
  title,
  paragraphs,
  imageSrc,
  imageAlt = "",
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
          <p className="text-xs font-semibold tracking-[0.3em] text-orange-500 uppercase">
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

        {/* Conteneur d'image mis à jour */}
        <div className="relative aspect-[4/5] w-full overflow-hidden rounded-md bg-neutral-900">
          <Image
            src={imageSrc}
            alt={imageAlt || title}
            fill
            sizes="(max-w: 1024px) 100vw, 50vw"
            className="object-cover"
            priority={!reverse} // Donne la priorité de chargement à la première image (Histoire)
          />
        </div>
      </div>
    </section>
  );
}
