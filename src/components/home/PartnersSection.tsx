import Button from "@/components/ui/Button";

const partnerships = [
  {
    number: "01",
    title: "SPONSORING",
    description:
      "Associez votre marque à un roster de combattants suivis et visibles, en compétition toute l'année.",
  },
  {
    number: "02",
    title: "ORGANISATION DE COMBATS",
    description:
      "Promoteurs et matchmakers : accédez rapidement à des profils vérifiés, avec records et catégories à jour.",
  },
  {
    number: "03",
    title: "COLLABORATION SALLE / CLUB",
    description:
      "Salles et clubs partenaires : accueillez nos camps, détectez ensemble les prochains talents.",
  },
  {
    number: "04",
    title: "VISIBILITÉ MÉDIA",
    description:
      "Médias et créateurs : accès aux combattants, aux coulisses et aux fight weeks.",
  },
];

export default function PartnersSection() {
  return (
    <section className="bg-neutral-950 py-20 lg:py-24">
      <div className="mx-auto w-full max-w-7xl px-4 lg:px-8">

        {/* En-tête */}
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-6 bg-orange-500" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-orange-500">
                Partenaires
              </span>
            </div>

            <h2 className="text-4xl font-extrabold uppercase leading-none tracking-tight text-white sm:text-5xl lg:text-6xl">
              Travailler avec l'agence
            </h2>

            <p className="mt-4 max-w-2xl text-sm text-neutral-400 sm:text-base">
              Promoteurs, sponsors, salles et médias : quatre façons de
              collaborer.
            </p>
          </div>

          <div className="shrink-0">
            <Button href="/partenaires" variant="outline">
              DEVENIR PARTENAIRE
            </Button>
          </div>
        </div>

        {/* Cartes */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {partnerships.map((partnership) => (
            <div
              key={partnership.number}
              className="group min-h-[210px] border border-neutral-800 bg-black/40 p-5 transition-colors duration-300 hover:border-neutral-700"
            >
              <span className="text-4xl font-bold leading-none text-orange-900/80">
                {partnership.number}
              </span>

              <h3 className="mt-5 text-lg font-extrabold uppercase leading-tight text-white">
                {partnership.title}
              </h3>

              <p className="mt-4 text-xs leading-relaxed text-neutral-400 sm:text-sm">
                {partnership.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}