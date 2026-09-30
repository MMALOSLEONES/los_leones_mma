import { ApplicationFormData } from "@/components/types/application";
import FormField from "@/components/candidater/FormField";
import Pill from "@/components/candidater/Pill";

type Props = {
  data: ApplicationFormData;
  update: (fields: Partial<ApplicationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const disciplines = ["MMA", "Boxe", "Kickboxing", "Grappling", "Lutte", "Judo", "Karaté", "Taekwondo", "Autre"];
const niveaux = ["Débutant", "Intermédiaire", "Avancé", "Professionnel"];

export default function StepProfilSportif({ data, update, onNext, onBack }: Props) {
  const isValid =
    data.aExperienceCombat === false ||
    (data.aExperienceCombat === true && data.discipline && data.niveau);

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">02 — PROFIL SPORTIF</h2>

      <div className="mt-8">
        <p className="text-xs font-semibold tracking-widest text-neutral-400">
          PRATIQUEZ-VOUS DÉJÀ UN SPORT DE COMBAT ?
        </p>
        <div className="mt-3 flex gap-2">
          <Pill
            active={data.aExperienceCombat === true}
            onClick={() => update({ aExperienceCombat: true })}
          >
            OUI
          </Pill>
          <Pill
            active={data.aExperienceCombat === false}
            onClick={() =>
              update({
                aExperienceCombat: false,
                discipline: "",
                niveau: "",
                anneesPratique: "",
                aFaitCompetitions: null,
              })
            }
          >
            NON
          </Pill>
        </div>
      </div>

      {data.aExperienceCombat === true && (
        <div className="mt-8 space-y-8 border-t border-white/10 pt-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-semibold tracking-widest text-neutral-400">
                DISCIPLINE
              </label>
              <select
                value={data.discipline}
                onChange={(e) => update({ discipline: e.target.value })}
                className="mt-2 w-full rounded-md border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none"
              >
                <option value="">Choisir...</option>
                {disciplines.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <FormField
              label="Années de pratique"
              type="number"
              value={data.anneesPratique}
              onChange={(v) => update({ anneesPratique: v })}
            />
          </div>

          <div>
            <p className="text-xs font-semibold tracking-widest text-neutral-400">
              NIVEAU
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {niveaux.map((n) => (
                <Pill
                  key={n}
                  active={data.niveau === n}
                  onClick={() => update({ niveau: n })}
                >
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
              <Pill
                active={data.aFaitCompetitions === true}
                onClick={() => update({ aFaitCompetitions: true })}
              >
                OUI
              </Pill>
              <Pill
                active={data.aFaitCompetitions === false}
                onClick={() =>
                  update({
                    aFaitCompetitions: false,
                    nombreCombats: "",
                    victoires: "",
                    defaites: "",
                    nuls: "",
                    kos: "",
                    soumissions: "",
                  })
                }
              >
                NON
              </Pill>
            </div>
          </div>

          {data.aFaitCompetitions === true && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <FormField
                label="Combats"
                type="number"
                value={data.nombreCombats}
                onChange={(v) => update({ nombreCombats: v })}
              />
              <FormField
                label="Victoires"
                type="number"
                value={data.victoires}
                onChange={(v) => update({ victoires: v })}
              />
              <FormField
                label="Défaites"
                type="number"
                value={data.defaites}
                onChange={(v) => update({ defaites: v })}
              />
              <FormField
                label="Nuls"
                type="number"
                value={data.nuls}
                onChange={(v) => update({ nuls: v })}
              />
              <FormField
                label="KO"
                type="number"
                value={data.kos}
                onChange={(v) => update({ kos: v })}
              />
              <FormField
                label="Soumissions"
                type="number"
                value={data.soumissions}
                onChange={(v) => update({ soumissions: v })}
              />
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
