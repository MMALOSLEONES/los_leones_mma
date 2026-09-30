const partnershipTypes = [
  {
    title: "SPONSORING",
    bullets: [
      "Logo sur les équipements du fighter",
      "Mise en avant sur les réseaux sociaux",
    ],
  },
  {
    title: "ORGANISATION DE COMBATS",
    bullets: [
      "Mise en relation avec des promoteurs",
      "Disponibilité pour des cartes ciblées",
    ],
  },
  {
    title: "COLLABORATION SALLE / CLUB",
    bullets: [
      "Accès à nos fighters pour stages ou séminaires",
      "Échange de visibilité mutuelle",
    ],
  },
  {
    title: "VISIBILITÉ MÉDIA",
    bullets: [
      "Interviews et contenus avec nos fighters",
      "Couverture d'événements associés",
    ],
  },
];

export default function PartnershipTypes() {
  return (
    <section className="border-t border-white/10 bg-neutral-950 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
          FORMATS
        </p>
        <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
          TYPES DE PARTENARIATS
        </h2>

        <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {partnershipTypes.map((type, index) => (
            <div
              key={type.title}
              className="rounded-md border border-white/10 bg-black p-6"
            >
              <span className="text-xs font-bold tracking-widest text-orange-500">
                0{index + 1}
              </span>
              <h3 className="mt-2 text-lg font-bold text-white">
                {type.title}
              </h3>
              <ul className="mt-4 space-y-2">
                {type.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2 text-sm text-neutral-400"
                  >
                    <span className="mt-1 h-1 w-1 flex-shrink-0 rounded-full bg-orange-500" />
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
