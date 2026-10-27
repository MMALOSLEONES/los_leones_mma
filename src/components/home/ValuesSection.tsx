
const values = [
  {
    title: "DISCIPLINE",
    description: "La progression commence par la discipline.",
  },
  {
    title: "FORCE",
    description: "Développer son corps et son mental.",
  },
  {
    title: "RESPECT",
    description: "Respecter ses partenaires, ses coachs et ses adversaires.",
  },
  {
    title: "DÉTERMINATION",
    description:
      "Continuer même lorsque le combat devient difficile.",
  },
];

export default function ValuesSection() {
  return (
    <section className="bg-neutral-950 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">
        {/* En-tête */}
        <div className="mb-10">
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-6 bg-orange-500" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-500">
              Notre philosophie
            </span>
          </div>

          <h2 className="text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
            Nos valeurs
          </h2>

          <p className="mt-4 max-w-2xl text-sm text-neutral-400 sm:text-base">
            Plus qu'un sport, un état d'esprit. Les principes qui guident
            chaque Leone.
          </p>
        </div>

        {/* Cartes */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {values.map((value, index) => (
            <div
              key={value.title}
              className="min-h-[190px] border border-neutral-800 bg-black/40 p-5 transition-colors duration-300 hover:border-neutral-700"
            >
              <span className="text-4xl font-bold leading-none text-orange-900/80">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-5 text-lg font-extrabold uppercase leading-tight text-white">
                {value.title}
              </h3>

              <p className="mt-4 text-xs leading-relaxed text-neutral-400 sm:text-sm">
                {value.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
