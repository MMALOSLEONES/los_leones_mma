import { ApplicationFormData } from "@/components/types/application";
import FormField from "@/components/candidater/FormField";

type Props = {
  data: ApplicationFormData;
  update: (fields: Partial<ApplicationFormData>) => void;
  onNext: () => void;
};

export default function StepInformations({ data, update, onNext }: Props) {
  const isValid =
    data.prenom && data.nom && data.dateNaissance && data.telephone && data.ville;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">01 — INFORMATIONS</h2>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <FormField
          label="Prénom"
          required
          value={data.prenom}
          onChange={(v) => update({ prenom: v })}
        />
        <FormField
          label="Nom"
          required
          value={data.nom}
          onChange={(v) => update({ nom: v })}
        />
        <FormField
          label="Date de naissance"
          type="date"
          required
          value={data.dateNaissance}
          onChange={(v) => update({ dateNaissance: v })}
        />
        <FormField
          label="Téléphone"
          type="tel"
          required
          placeholder="+221 77 000 00 00"
          value={data.telephone}
          onChange={(v) => update({ telephone: v })}
        />
        <FormField
          label="Email"
          type="email"
          value={data.email}
          onChange={(v) => update({ email: v })}
        />
        <FormField
          label="Ville"
          required
          value={data.ville}
          onChange={(v) => update({ ville: v })}
        />
        <FormField
          label="Quartier (optionnel)"
          value={data.quartier}
          onChange={(v) => update({ quartier: v })}
        />
      </div>

      <div className="mt-10 flex justify-end border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onNext}
          disabled={!isValid}
          className="rounded-md bg-orange-500 px-6 py-3 text-xs font-bold tracking-widest text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          CONTINUER
        </button>
      </div>
    </div>
  );
}
