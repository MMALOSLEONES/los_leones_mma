import type { Fighter } from "@/components/types/fighter";

type Props = {
  fighter: Fighter;
  photosTitle: string; // texte déjà traduit, fourni par la page
  videosTitle: string;
};

// Photos supplémentaires et vidéos de la fiche d'un fighter.
// La première photo est déjà affichée en grand en haut de la fiche : on ne la répète pas.
export default function FighterGallery({ fighter, photosTitle, videosTitle }: Props) {
  const photos = fighter.photos.slice(1);
  const { videos } = fighter;

  if (photos.length === 0 && videos.length === 0) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 lg:px-8">
      {photos.length > 0 && (
        <div>
          <h2 className="text-xs font-bold tracking-widest text-orange-500">{photosTitle}</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((url, index) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block overflow-hidden rounded-md"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${fighter.fullName} — ${index + 2}`}
                  className="aspect-[3/4] w-full object-cover transition hover:opacity-90"
                />
              </a>
            ))}
          </div>
        </div>
      )}

      {videos.length > 0 && (
        <div className={photos.length > 0 ? "mt-12" : ""}>
          <h2 className="text-xs font-bold tracking-widest text-orange-500">{videosTitle}</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {videos.map((video) => (
              <video
                key={video.id}
                src={video.url}
                controls
                preload="metadata"
                playsInline
                className="aspect-video w-full rounded-md bg-black"
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
