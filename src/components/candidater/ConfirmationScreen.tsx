import { CheckCircle } from "lucide-react";
import Button from "@/components/ui/Button";

export default function ConfirmationScreen({
  referenceCode,
}: {
  referenceCode: string;
}) {
  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <CheckCircle className="mx-auto text-orange-500" size={48} />
      <h1 className="mt-6 text-3xl font-extrabold text-white">
        CANDIDATURE ENVOYÉE
      </h1>
      <p className="mt-4 text-sm text-neutral-400">
        Merci. Votre dossier a bien été transmis à l&apos;équipe Los Leones.
        Un agent vous recontacte sous 7 jours pour la suite du processus.
      </p>

      <div className="mt-6 inline-block rounded-md border border-white/20 px-4 py-2 text-xs font-semibold tracking-widest text-neutral-300">
        RÉFÉRENCE : {referenceCode}
      </div>

      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Button href="/">RETOUR À L&apos;ACCUEIL</Button>
        <Button href="/contact" variant="outline">
          NOUS ÉCRIRE
        </Button>
      </div>
    </div>
  );
}
