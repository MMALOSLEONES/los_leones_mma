import type { ApplicationFormData } from "@/components/types/application";
import FormField from "@/components/candidater/FormField";
import Pill from "@/components/candidater/Pill";
import { countError, recordError } from "@/lib/validation";

type Props = {
  data: ApplicationFormData;
  update: (fields: Partial<ApplicationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const niveaux = ["Débutant", "Intermédiaire", "Avancé", "Professionnel"];

const recordFields = [
  { label: "Combats", key: "nombreCombats" },
  { label: "Victoires", key: "victoires" },
  { label: "Défaites", key: "defaites" },
  { label: "Nuls", key: "nuls" },
  { label: "KO", key: "kos" },
  { label: "Soumissions", key: "soumissions" },
] as const;

const emptyRecord = {
  nombreCombats: "",
  victoires: "",
  defaites: "",
  nuls: "",
  kos: "",
  soumissions: "",
};

export default function StepProfilSportif({ data, update, onNext, onBack }: Props) {
  const anyCountError = recordFields.some(({ key }) => countError(data[key]));
  const recordErr = recordError(data);

  const competitionsOk =
    data.aFaitCompetitions === false ||
    (data.aFaitCompetitions === true &&
      Number(data.nombreCombats) >= 1 &&
      !anyCountError &&
      !recordErr);

  const isValid =
    data.aExperienceCombat === false ||
    (data.aExperienceCombat === true && Boolean(data.niveau) && competitionsOk);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">02 — PROFIL SPORTIF</h2>

      <div className="mt-8">
        <p className="text-xs font-semibold tracking-widest text-neutral-400">
          PRATIQUEZ-VOUS DÉJÀ UN SPORT DE COMBAT ?
        </p>
        <div className="mt-3 flex gap-2">
          <Pill active={data.aExperienceCombat === true} onClick={() => update({ aExperienceCombat: true })}>
            OUI
          </Pill>
          <Pill
            active={data.aExperienceCombat === false}
            onClick={() =>
              update({ aExperienceCombat: false, niveau: "", aFaitCompetitions: null, ...emptyRecord })
            }
          >
            NON
          </Pill>
        </div>
      </div>

      {data.aExperienceCombat === true && (
        <div className="mt-8 space-y-8 border-t border-white/10 pt-8">
          <div>
            <p className="text-xs font-semibold tracking-widest text-neutral-400">NIVEAU</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {niveaux.map((n) => (
                <Pill key={n} active={data.niveau === n} onClick={() => update({ niveau: n })}>
                  {n.toUpperCase()}
                </Pill>
              ))}
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-neutral-400">
              AVEZ-VOUS DÉJÀ PARTICIPÉ À DES COMPÉTITIONS ?
            </p>
            <div className="mt-3 flex gap-2">
              <Pill active={data.aFaitCompetitions === true} onClick={() => update({ aFaitCompetitions: true })}>
                OUI
              </Pill>
              <Pill
                active={data.aFaitCompetitions === false}
                onClick={() => update({ aFaitCompetitions: false, ...emptyRecord })}
              >
                NON
              </Pill>
            </div>
          </div>

          {data.aFaitCompetitions === true && (
            <div>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                {recordFields.map(({ label, key }) => (
                  <FormField
                    key={key}
                    label={label}
                    type="number"
                    inputMode="numeric"
                    min={0}
                    required={key === "nombreCombats"}
                    value={data[key]}
                    onChange={(v) => update({ [key]: v })}
                    error={countError(data[key])}
                  />
                ))}
              </div>
              {recordErr && !anyCountError && (
                <p className="mt-4 text-xs text-red-400">{recordErr}</p>
              )}
            </div>
          )}
        </div>
      )}

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
