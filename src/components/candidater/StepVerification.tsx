
import type { ApplicationFormData } from "@/components/types/application";
import { useTranslations } from "next-intl";

type PaymentRail = "sn_wave" | "sn_orange";

type Props = {
  data: ApplicationFormData;
  update: (fields: Partial<ApplicationFormData>) => void;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  onSubmit: () => void;
  submitting?: boolean;
  paymentRail: PaymentRail | "";
  onPaymentRailChange: (rail: PaymentRail) => void;
};

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 py-3">
      <span className="text-xs font-semibold tracking-widest text-neutral-500">
        {label}
      </span>
      <span className="text-right text-sm text-white">
        {value || "—"}
      </span>
    </div>
  );
}

function SectionHeader({
  title,
  onModify,
  ctaText,
}: {
  title: string;
  onModify: () => void;
  ctaText: string;
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
        {ctaText}
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
  paymentRail,
  onPaymentRailChange,
}: Props) {
  const t = useTranslations("StepVerification");

  const birth = data.dateNaissance.split("-").reverse().join("/");

  const competitionsText = (d: ApplicationFormData) => {
    if (d.aExperienceCombat !== true) return "—";
    if (d.aFaitCompetitions !== true) return t("aucune");

    return t("competitionsFormat", {
      combats: d.nombreCombats,
      victoires: d.victoires || 0,
      defaites: d.defaites || 0,
      nuls: d.nuls || 0,
      kos: d.kos || 0,
      soumissions: d.soumissions || 0,
    });
  };

  const getMediaSummaryText = () => {
    const photosCount = data.photos?.length ?? 0;
    const videosCount = data.videos?.length ?? 0;

    if (photosCount === 0 && videosCount === 0) return "—";

    const parts = [];
    if (photosCount > 0) parts.push(`${photosCount} photo(s)`);
    if (videosCount > 0) parts.push(`${videosCount} vidéo(s)`);

    return parts.join(" & ");
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">
        {t("title")}
      </h2>

      <p className="mt-2 text-sm text-neutral-400">
        {t("description")}
      </p>

      <SectionHeader
        title={t("sections.informations")}
        onModify={() => onGoToStep(1)}
        ctaText={t("modifier")}
      />

      <SummaryRow
        label={t("labels.nomComplet")}
        value={`${data.prenom} ${data.nom}`}
      />

      <SummaryRow
        label={t("labels.naissance")}
        value={birth}
      />

      <SummaryRow
        label={t("labels.telephone")}
        value={data.telephone}
      />

      <SummaryRow
        label={t("labels.email")}
        value={data.email}
      />

      <SummaryRow
        label={t("labels.poids")}
        value={data.poidsKg ? `${data.poidsKg} kg` : ""}
      />

      <SummaryRow
        label={t("labels.ville")}
        value={[data.ville, data.quartier].filter(Boolean).join(" — ")}
      />

      <SectionHeader
        title={t("sections.profilSportif")}
        onModify={() => onGoToStep(2)}
        ctaText={t("modifier")}
      />

      <SummaryRow
        label={t("labels.sportCombat")}
        value={data.aExperienceCombat ? t("oui") : t("non")}
      />

      {data.aExperienceCombat && (
        <>
          <SummaryRow
            label={t("labels.niveau")}
            value={data.niveau}
          />

          <SummaryRow
            label={t("labels.competitions")}
            value={competitionsText(data)}
          />
        </>
      )}

      <SectionHeader
        title={t("sections.photo")}
        onModify={() => onGoToStep(3)}
        ctaText={t("modifier")}
      />

      <SummaryRow
        label={t("labels.fichier")}
        value={getMediaSummaryText()}
      />

      <SummaryRow
        label={t("labels.source")}
        value={data.commentConnu}
      />

      {/* Conditions générales */}
      <label className="mt-8 flex items-start gap-3 text-sm text-neutral-400">
        <input
          type="checkbox"
          checked={data.consentAccepted}
          onChange={(e) =>
            update({ consentAccepted: e.target.checked })
          }
          className="mt-1 h-4 w-4 accent-orange-500"
        />

        <span>
          J'accepte les{" "}
          <a
            href="/conditions-generales"
            target="_blank"
            rel="noopener noreferrer"
            className="font-semibold text-orange-500 underline hover:text-orange-400"
          >
            conditions générales
          </a>{" "}
          de candidature et de paiement.
        </span>
      </label>

      {/* Moyen de paiement */}
      <div className="mt-8 border-t border-white/10 pt-6">
        <h3 className="text-xs font-bold tracking-widest text-orange-500">
          MOYEN DE PAIEMENT
        </h3>

        <p className="mt-2 text-sm text-neutral-400">
          Choisissez le moyen avec lequel vous souhaitez régler les frais de candidature.
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => onPaymentRailChange("sn_wave")}
            aria-pressed={paymentRail === "sn_wave"}
            className={`rounded-md border px-4 py-4 text-sm font-bold transition ${
              paymentRail === "sn_wave"
                ? "border-orange-500 bg-orange-500/10 text-white"
                : "border-white/10 text-neutral-400 hover:border-white/30"
            }`}
          >
            Wave
          </button>

          <button
            type="button"
            onClick={() => onPaymentRailChange("sn_orange")}
            aria-pressed={paymentRail === "sn_orange"}
            className={`rounded-md border px-4 py-4 text-sm font-bold transition ${
              paymentRail === "sn_orange"
                ? "border-orange-500 bg-orange-500/10 text-white"
                : "border-white/10 text-neutral-400 hover:border-white/30"
            }`}
          >
            Orange Money
          </button>
        </div>

        <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
          <span className="text-sm text-neutral-400">
            Frais de candidature
          </span>

          <span className="text-lg font-bold text-white">
            10 000 FCFA
          </span>
        </div>
      </div>

      {/* Navigation et paiement */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          disabled={submitting}
          className="rounded-md border border-white/20 px-6 py-3 text-xs font-bold tracking-widest text-white hover:border-white/40 disabled:opacity-40"
        >
          {t("retour")}
        </button>

        <button
          type="button"
          onClick={onSubmit}
          disabled={
            !data.consentAccepted ||
            !paymentRail ||
            submitting ||
            (data.photos?.length ?? 0) === 0
          }
          className="rounded-md bg-orange-500 px-6 py-3 text-xs font-bold tracking-widest text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? "REDIRECTION EN COURS..." : "PAYER 10 000 FCFA"}
        </button>
      </div>
    </div>
  );
}
