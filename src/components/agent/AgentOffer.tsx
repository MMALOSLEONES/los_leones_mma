const offers = [
  {
    title: "MISE EN RELATION",
    description:
      "Contact direct avec des promoteurs, des sponsors et des salles partenaires.",
  },
  {
    title: "NÉGOCIATION",
    description:
      "Gestion des contrats de combat pour défendre les intérêts du fighter.",
  },
  {
    title: "ACCOMPAGNEMENT CARRIÈRE",
    description:
      "Un suivi sur le long terme, pas juste combat par combat.",
  },
  {
    title: "VISIBILITÉ",
    description:
      "Mise en avant des fighters auprès de l'écosystème MMA et du public.",
  },
];

export default function AgentOffer() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 lg:px-8">
      <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
        CE QU&apos;IL APPORTE
      </p>
      <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
        UN VRAI ACCOMPAGNEMENT
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-px bg-white/10 sm:grid-cols-2">
        {offers.map((offer, index) => (
          <div key={offer.title} className="bg-black px-6 py-10">
            <span className="text-xs font-bold tracking-widest text-orange-500">
              0{index + 1}
            </span>
            <h3 className="mt-3 text-lg font-bold text-white">
              {offer.title}
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              {offer.description}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
