import Button from "@/components/ui/Button";

export default function PartnerHero() {
  return (
    <section className="border-b border-white/10 bg-neutral-950 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
          PARTENAIRES
        </p>
        <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-6xl">
          DEVENIR PARTENAIRE DE LOS LEONES
        </h1>
        <p className="mt-4 text-neutral-400">
          Promoteurs, sponsors, salles et marques — associez-vous à une
          agence qui structure et fait grandir une génération de
          combattants sénégalais.
        </p>
        <Button href="/contact" className="mt-8 w-fit">
          NOUS CONTACTER
        </Button>
      </div>
    </section>
  );
}
