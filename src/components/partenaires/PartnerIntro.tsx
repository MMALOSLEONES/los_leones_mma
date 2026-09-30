const highlights = [
  {
    title: "ROSTER",
    description: "8 fighters actifs suivis en continu par l'agence.",
  },
  {
    title: "COMMUNICATION",
    description: "Présence régulière et maîtrisée sur les réseaux sociaux.",
  },
  {
    title: "ÉVÉNEMENTS",
    description: "Participation à des cartes de combat locales et régionales.",
  },
  {
    title: "SUIVI",
    description: "Un reporting simple sur la visibilité générée.",
  },
];

export default function PartnerIntro() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div>
          <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
            PARTENARIAT PRIVILÉGIÉ
          </p>
          <h2 className="mt-3 text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            UN ROSTER SUIVI, UNE IMAGE MAÎTRISÉE
          </h2>
          <p className="mt-6 text-neutral-400">
            Les fighters représentés par Los Leones sont accompagnés avec
            rigueur : préparation, discipline, image maîtrisée. Chaque
            partenariat bénéficie de cette exigence — votre marque associée
            à des combattants sérieux, pas à l&apos;improvisation.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
          {highlights.map((item) => (
            <div key={item.title} className="bg-black p-6">
              <h3 className="text-sm font-bold tracking-wide text-orange-500">
                {item.title}
              </h3>
              <p className="mt-2 text-sm text-neutral-400">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
