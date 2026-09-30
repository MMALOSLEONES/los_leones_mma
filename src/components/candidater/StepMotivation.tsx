import {
  ApplicationFormData,
  ObjectifCandidature,
  SourceConnaissance,
} from "@/components/types/application";
import Pill from "@/components/candidater/Pill";

type Props = {
  data: ApplicationFormData;
  update: (fields: Partial<ApplicationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const objectifsOptions: ObjectifCandidature[] = [
  "Apprendre le MMA",
  "Améliorer ma condition physique",
  "Faire de la compétition",
  "Devenir professionnel",
  "Préparer un combat",
  "Développer mes compétences",
  "Autre",
];

const sources: SourceConnaissance[] = [
  "Instagram",
  "TikTok",
  "Facebook",
  "WhatsApp",
  "Recommandation",
  "Google",
  "Autre",
];

export default function StepMotivation({ data, update, onNext, onBack }: Props) {
  const toggleObjectif = (objectif: ObjectifCandidature) => {
    const already = data.objectifs.includes(objectif);
    update({
      objectifs: already
        ? data.objectifs.filter((o) => o !== objectif)
        : [...data.objectifs, objectif],
    });
  };

  const isValid = data.motivation.trim().length > 0;

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">03 — MOTIVATION</h2>

      <div className="mt-8">
        <label className="block text-xs font-semibold tracking-widest text-neutral-400">
          POURQUOI VOULEZ-VOUS REJOINDRE LOS LEONES ?
        </label>
        <textarea
          value={data.motivation}
          onChange={(e) => update({ motivation: e.target.value })}
          rows={5}
          className="mt-2 w-full resize-none rounded-md border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
        />
      </div>

      <div className="mt-8">
        <p className="text-xs font-semibold tracking-widest text-neutral-400">
          VOS OBJECTIFS
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {objectifsOptions.map((objectif) => (
            <Pill
              key={objectif}
              active={data.objectifs.includes(objectif)}
              onClick={() => toggleObjectif(objectif)}
            >
              {objectif.toUpperCase()}
            </Pill>
          ))}
        </div>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label className="block text-xs font-semibold tracking-widest text-neutral-400">
            COMMENT AVEZ-VOUS CONNU LOS LEONES ?
          </label>
          <select
            value={data.commentConnu}
            onChange={(e) =>
              update({ commentConnu: e.target.value as SourceConnaissance })
            }
            className="mt-2 w-full rounded-md border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
          >
            <option value="">Choisir...</option>
            {sources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold tracking-widest text-neutral-400">
            PHOTO (OPTIONNEL)
          </label>
          <div className="mt-2 flex items-center gap-3">
            <label className="cursor-pointer rounded-md border border-white/20 px-4 py-3 text-xs font-semibold tracking-wide text-white hover:border-white/40">
              CHOISIR UN FICHIER
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) =>
                  update({ photoFileName: e.target.files?.[0]?.name ?? "" })
                }
              />
            </label>
            <span className="text-xs text-neutral-500">
              {data.photoFileName || "Aucun fichier"}
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10 flex justify-between border-t border-white/10 pt-6">
        <button
          type="button"
          onClick={onBack}
          className="rounded-md border border-white/20 px-6 py-3 text-xs font-bold tracking-widest text-white hover:border-white/40"
        >
          ‹ RETOUR
        </button>
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
