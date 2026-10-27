
const announcements = [
  "IMPORTANT",
  "CAMP",
  "IMPORANT",
  "CAMP",
  "IMPORTANT",
   "IMPORTANT",
  "CAMP",
  "IMPORANT",
  "CAMP",
  "IMPORTANT"
];

export default function AnnouncementBar() {
  return (
    <section
      aria-label="Les valeurs de Los Leones"
      className="overflow-hidden border-y border-black/20 bg-orange-500 py-4"
    >
      <div className="flex w-max animate-marquee">
        {[...announcements, ...announcements].map((item, index) => (
          <div
            key={`${item}-${index}`}
            className="flex shrink-0 items-center gap-8 px-4"
          >
            <span className="whitespace-nowrap text-xs font-black uppercase tracking-[0.2em] text-black sm:text-sm">
              {item}
            </span>

            <span
              aria-hidden="true"
              className="h-2 w-2 shrink-0 rotate-45 bg-black"
            />
          </div>
        ))}
      </div>
    </section>
  );
}
