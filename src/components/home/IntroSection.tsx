import Button from "@/components/ui/Button";

export default function IntroSection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl">
            PLUS QU&apos;UN CLUB.
            <br />
            UNE ÉQUIPE.
          </h2>
          <p className="mt-6 text-neutral-400">
            Los Leones accompagne ses fighters à chaque étape de leur
            carrière : progression technique, préparation physique, mental
            de compétiteur, et mise en relation avec les bonnes
            opportunités pour se faire un nom dans le MMA.
          </p>
          <Button href="/club" variant="outline" className="mt-8">
            DÉCOUVRIR LE CLUB
          </Button>
        </div>

        {/* Placeholder image éditoriale */}
        <div className="aspect-[4/5] w-full rounded-md bg-[linear-gradient(160deg,#1a1a1a,#0a0a0a)]" />
      </div>
    </section>
  );
}