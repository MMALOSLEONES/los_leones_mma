import { ApplicationFormData } from "@/components/types/application";

type Props = {
  data: ApplicationFormData;
  update: (fields: Partial<ApplicationFormData>) => void;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  onSubmit: () => void;
  submitting?: boolean;
};

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-3">
      <span className="text-xs font-semibold tracking-widest text-neutral-500">
        {label}
      </span>
      <span className="text-sm text-white">{value || "—"}</span>
    </div>
  );
}

function SectionHeader({
  title,
  onModify,
}: {
  title: string;
  onModify: () => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-between">
      <h3 className="text-xs font-bold tracking-widest text-orange-500">
        {title}
      </h3>
      <button
        type="button"
        onClick={onModify}
        className="text-xs font-semibold text-neutral-400 hover:text-white"
      >
        MODIFIER
      </button>
    </div>
  );
}

export default function StepVerification({
  data,
  update,
  onBack,
  onGoToStep,
  onSubmit,
  submitting = false,
}: Props) {
  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">04 — VÉRIFICATION</h2>
      <p className="mt-2 text-sm text-neutral-400">
        Vérifie tes informations avant d&apos;envoyer ta candidature.
      </p>

      <SectionHeader title="INFORMATIONS" onModify={() => onGoToStep(1)} />
      <SummaryRow label="Nom complet" value={`${data.prenom} ${data.nom}`} />
      <SummaryRow label="Date de naissance" value={data.dateNaissance} />
      <SummaryRow label="Téléphone" value={data.telephone} />
      <SummaryRow label="Email" value={data.email} />
      <SummaryRow label="Ville" value={data.ville} />

      <SectionHeader title="PROFIL SPORTIF" onModify={() => onGoToStep(2)} />
      <SummaryRow
        label="Sport de combat"
        value={data.aExperienceCombat ? "Oui" : "Non"}
      />
      {data.aExperienceCombat && (
        <>
          <SummaryRow label="Discipline" value={data.discipline} />
          <SummaryRow label="Niveau" value={data.niveau} />
        </>
      )}

      <SectionHeader title="MOTIVATION" onModify={() => onGoToStep(3)} />
      <SummaryRow label="Objectifs" value={data.objectifs.join(", ")} />
      <SummaryRow label="Source" value={data.commentConnu} />
      <SummaryRow label="Photo" value={data.photoFileName} />

      <label className="mt-8 flex items-start gap-3 text-sm text-neutral-400">
        <input
          type="checkbox"
          checked={data.consentAccepted}
          onChange={(e) => update({ consentAccepted: e.target.checked })}
          className="mt-1 h-4 w-4 accent-orange-500"
        />
        J&apos;accepte que Los Leones utilise les informations fournies afin
        d&apos;étudier ma candidature.
      </label>

      <div className="mt-10 flex justify-between border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-md border border-white/20 px-6 py-3 text-xs font-bold tracking-widest text-white hover:border-white/40 disabled:opacity-40"
        >
          ‹ RETOUR
        </button>
        <button
          type="button"
          onClick={onSubmit}
          disabled={!data.consentAccepted || submitting}
          className="rounded-md bg-orange-500 px-6 py-3 text-xs font-bold tracking-widest text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "ENVOI EN COURS..." : "ENVOYER MA CANDIDATURE"}
        </button>
      </div>
    </div>
  );
}