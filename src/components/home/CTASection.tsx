import Button from "@/components/ui/Button";

export default function CTASection() {
  return (
    <section className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-4xl px-4 py-24 text-center lg:px-8">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
          DEVIENS UN LEONE
        </h2>
        <p className="mt-4 text-neutral-400">
          Rejoins une équipe qui investit dans tes ambitions de combattant.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="/candidater">REJOINDRE LOS LEONES</Button>
          <Button href="/contact" variant="outline">
            NOUS CONTACTER
          </Button>
        </div>
      </div>
    </section>
  );
}
