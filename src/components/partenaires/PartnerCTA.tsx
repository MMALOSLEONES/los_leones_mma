import Button from "@/components/ui/Button";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function PartnerCTA() {
  return (
    <section className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
      <div className="rounded-md border border-white/10 px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          PARLONS DE VOTRE PROJET
        </h2>
        <p className="mx-auto mt-4 max-w-md text-neutral-400">
          Contactez-nous pour construire ensemble un partenariat qui vous
          ressemble.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/contact">NOUS CONTACTER</Button>
          <WhatsAppButton
            variant="outline"
            message="Bonjour, je souhaite en savoir plus sur un partenariat avec Los Leones."
          />
        </div>
      </div>
    </section>
  );
}
