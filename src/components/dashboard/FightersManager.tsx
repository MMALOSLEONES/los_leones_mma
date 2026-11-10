"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/candidater/FormField";
import {
  SelectField,
  TextAreaField,
  btnPrimary,
  btnOutline,
  btnDanger,
} from "@/components/dashboard/fields";
import FighterEditor from "@/components/dashboard/FighterEditor";
import PhotoPicker from "@/components/dashboard/PhotoPicker";
import { adminRequest, adminUpload } from "@/lib/adminFetch";
import {
  MAX_PHOTOS,
  MAX_VIDEOS,
  uploadFighterVideo,
  videoFileError,
} from "@/lib/fighterMedia";
import { FIGHTER_LEVELS, WEIGHT_CATEGORIES } from "@/lib/labels";
import { parseWeight } from "@/lib/weight";
import type { FighterApi } from "@/components/types/api";

const emptyForm = {
  prenom: "",
  nom: "",
  surnom: "",
  poids_kg: "",
  weight_category: "",
  niveau: "",
  reseaux: "",
  bio: "",
  style_de_combat: "",
  palmares: "",
  victoire: "",
  defaite: "",
  nul: "",
  ko: "",
  soumission: "",
};

type FormState = typeof emptyForm;

const toInt = (value: string) => Number.parseInt(value, 10) || 0;

const megaOctets = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1)} Mo`;

// Choix des vidéos du formulaire d'ajout (la liste reste dans le parent)
function VideoFilesPicker({
  files,
  onChange,
}: {
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const [error, setError] = useState("");

  const add = (list: File[]) => {
    setError("");

    const accepted: File[] = [];
    const problems: string[] = [];

    for (const file of list) {
      if (files.length + accepted.length >= MAX_VIDEOS) {
        problems.push(`Maximum ${MAX_VIDEOS} vidéos.`);
        break;
      }

      const problem = videoFileError(file);

      if (problem) {
        problems.push(`${file.name} : ${problem}`);
      } else {
        accepted.push(file);
      }
    }

    if (accepted.length > 0) {
      onChange([...files, ...accepted]);
    }

    if (problems.length > 0) {
      setError(problems.join(" "));
    }
  };

  return (
    <div>
      <p className="text-xs font-semibold tracking-widest text-neutral-400">
        VIDÉOS ({files.length}/{MAX_VIDEOS})
      </p>

      {files.length > 0 && (
        <ul className="mt-3 space-y-2">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between gap-3 rounded-md border border-white/10 px-3 py-2 text-sm text-neutral-300"
            >
              <span className="truncate">
                {file.name} · {megaOctets(file.size)}
              </span>

              <button
                type="button"
                onClick={() => onChange(files.filter((_, i) => i !== index))}
                className="shrink-0 text-xs font-semibold text-red-400 hover:text-red-300"
              >
                Retirer
              </button>
            </li>
          ))}
        </ul>
      )}

      <label
        className={`${btnOutline} mt-3 inline-block cursor-pointer ${
          files.length >= MAX_VIDEOS ? "pointer-events-none opacity-40" : ""
        }`}
      >
        AJOUTER DES VIDÉOS
        <input
          type="file"
          accept="video/mp4,video/webm"
          multiple
          className="hidden"
          disabled={files.length >= MAX_VIDEOS}
          onChange={(e) => {
            const list = Array.from(e.target.files ?? []);
            e.target.value = "";
            add(list);
          }}
        />
      </label>

      <p className="mt-2 text-xs text-neutral-500">
        MP4 ou WebM, 150 Mo maximum chacune. Compresse-les avant (720p suffit).
      </p>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function FightersManager({
  fighters,
}: {
  fighters: FighterApi[];
}) {
  const router = useRouter();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [photos, setPhotos] = useState<File[]>([]);
  const [videos, setVideos] = useState<File[]>([]);
  const [pickerKey, setPickerKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [percent, setPercent] = useState<number | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const editingFighter = fighters.find((f) => f.id === editingId) ?? null;

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setPhotos([]);
    setVideos([]);
    setPickerKey((k) => k + 1);
    setShowForm(false);
  };

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.poids_kg.trim() && parseWeight(form.poids_kg) === null) {
      setError("Poids invalide (exemple : 77 ou 77,5).");
      return;
    }

    setSaving(true);

    // 1) Création initiale du fighter
    let fighterId: string | undefined;

    try {
      const result = await adminRequest<{
        data?: { id?: string };
        id?: string;
      }>("/fighters", "POST", {
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        surnom: form.surnom.trim() || null,
        poids_kg: parseWeight(form.poids_kg),
        weight_category: form.weight_category || null,
        niveau: form.niveau || null,
        reseaux: form.reseaux.trim() || null,
        bio: form.bio.trim() || null,
        style_de_combat: form.style_de_combat.trim() || null,
        palmares: form.palmares.trim() || null,
        victoire: toInt(form.victoire),
        defaite: toInt(form.defaite),
        nul: toInt(form.nul),
        ko: toInt(form.ko),
        soumission: toInt(form.soumission),
        combat: toInt(form.victoire) + toInt(form.defaite) + toInt(form.nul),
        is_active: true,
      });

      fighterId = result.data?.id ?? result.id;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ajout impossible.");
      setSaving(false);
      return;
    }

    // 2) Les médias associés
    const problems: string[] = [];

    if (!fighterId && (photos.length > 0 || videos.length > 0)) {
      problems.push("identifiant du fighter introuvable.");
    } else if (fighterId) {
      for (let i = 0; i < photos.length; i++) {
        setStatus(`Envoi de la photo ${i + 1}/${photos.length}...`);

        try {
          await adminUpload(`/fighters/${fighterId}/photos`, photos[i]);
        } catch (err) {
          problems.push(
            `photo ${i + 1} (${err instanceof Error ? err.message : "échec"}).`,
          );
        }
      }

      for (let i = 0; i < videos.length; i++) {
        setStatus(`Envoi de la vidéo ${i + 1}/${videos.length}...`);
        setPercent(0);

        try {
          await uploadFighterVideo(fighterId, videos[i], setPercent);
        } catch (err) {
          problems.push(
            `vidéo « ${videos[i].name} » (${err instanceof Error ? err.message : "échec"}).`,
          );
        }
      }
    }

    setStatus("");
    setPercent(null);
    resetForm();

    if (problems.length > 0) {
      setError(
        `Fighter ajouté, mais ces médias n'ont pas pu être envoyés : ${problems.join(" ")} Ouvre « Modifier » pour les ajouter.`,
      );
    }

    router.refresh();
    setSaving(false);
  };

  const remove = async (fighter: FighterApi) => {
    if (
      !window.confirm(
        `Supprimer ${fighter.prenom} ${fighter.nom} définitivement ?`,
      )
    ) {
      return;
    }

    setBusyId(fighter.id);
    setError("");

    try {
      await adminRequest(`/fighters/${fighter.id}`, "DELETE");

      if (editingId === fighter.id) {
        setEditingId(null);
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">
          {fighters.length} fighter{fighters.length > 1 ? "s" : ""}
        </p>

        <button
          onClick={() => {
            setEditingId(null);

            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          className={btnPrimary}
        >
          {showForm ? "ANNULER" : "AJOUTER UN FIGHTER"}
        </button>
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {showForm && (
        <form
          onSubmit={create}
          className="mt-6 rounded-md border border-white/10 bg-neutral-950 p-5"
        >
          <fieldset disabled={saving} className="space-y-8">
            {/* INFORMATIONS PERSONNELLES */}
            <div>
              <p className="mb-5 text-xs font-semibold tracking-widest text-orange-500">
                INFORMATIONS DU FIGHTER
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  label="Prénom"
                  required
                  value={form.prenom}
                  onChange={set("prenom")}
                />

                <FormField
                  label="Nom"
                  required
                  value={form.nom}
                  onChange={set("nom")}
                />

                <FormField
                  label="Surnom"
                  value={form.surnom}
                  onChange={set("surnom")}
                />

                <FormField
                  label="Réseaux (lien Instagram)"
                  value={form.reseaux}
                  onChange={set("reseaux")}
                />

                <FormField
                  label="Poids (kg)"
                  inputMode="decimal"
                  placeholder="77"
                  value={form.poids_kg}
                  onChange={set("poids_kg")}
                />

                <SelectField
                  label="Catégorie de poids"
                  value={form.weight_category}
                  onChange={set("weight_category")}
                  options={WEIGHT_CATEGORIES}
                  placeholder="Automatique (selon le poids)"
                />

                <SelectField
                  label="Niveau"
                  value={form.niveau}
                  onChange={set("niveau")}
                  options={FIGHTER_LEVELS}
                  placeholder="Choisir..."
                />
              </div>
            </div>

            {/* MÉDIAS */}
            <div>
              <p className="mb-5 text-xs font-semibold tracking-widest text-orange-500">
                PHOTOS ET VIDÉOS
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div className="rounded-md border border-white/10 bg-white/[0.02] p-4">
                  <PhotoPicker
                    key={`photos-${pickerKey}`}
                    multiple
                    max={MAX_PHOTOS}
                    label="Photos du fighter"
                    onChange={setPhotos}
                  />
                </div>

                <div className="rounded-md border border-white/10 bg-white/[0.02] p-4">
                  <VideoFilesPicker
                    key={`videos-${pickerKey}`}
                    files={videos}
                    onChange={setVideos}
                  />
                </div>
              </div>
            </div>

            {/* STATISTIQUES */}
            <div>
              <p className="mb-5 text-xs font-semibold tracking-widest text-orange-500">
                STATISTIQUES DE COMBAT
              </p>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <FormField
                  label="Victoires"
                  type="number"
                  min={0}
                  value={form.victoire}
                  onChange={set("victoire")}
                />

                <FormField
                  label="Défaites"
                  type="number"
                  min={0}
                  value={form.defaite}
                  onChange={set("defaite")}
                />

                <FormField
                  label="Nuls"
                  type="number"
                  min={0}
                  value={form.nul}
                  onChange={set("nul")}
                />

                <FormField
                  label="KO"
                  type="number"
                  min={0}
                  value={form.ko}
                  onChange={set("ko")}
                />

                <FormField
                  label="Soumissions"
                  type="number"
                  min={0}
                  value={form.soumission}
                  onChange={set("soumission")}
                />
              </div>
            </div>

            {/* INFORMATIONS COMPLÉMENTAIRES */}
            <div>
              <p className="mb-5 text-xs font-semibold tracking-widest text-orange-500">
                PROFIL ET PARCOURS
              </p>

              <div className="space-y-5">
                <TextAreaField
                  label="Bio"
                  rows={4}
                  value={form.bio}
                  onChange={set("bio")}
                />

                <TextAreaField
                  label="Style de combat"
                  rows={3}
                  value={form.style_de_combat}
                  onChange={set("style_de_combat")}
                />

                <TextAreaField
                  label="Palmarès (une réalisation par ligne)"
                  rows={4}
                  value={form.palmares}
                  onChange={set("palmares")}
                />
              </div>
            </div>

            {/* BOUTONS */}
            <div className="flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving || !form.prenom.trim() || !form.nom.trim()}
                className={btnPrimary}
              >
                {saving ? "ENREGISTREMENT..." : "ENREGISTRER"}
              </button>

              <button type="button" onClick={resetForm} className={btnOutline}>
                ANNULER
              </button>
            </div>

            {status && <p className="text-sm text-neutral-400">{status}</p>}

            {percent !== null && (
              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded-full bg-neutral-800">
                  <div
                    className="h-full bg-orange-500 transition-all"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-400">{percent} %</p>
              </div>
            )}
          </fieldset>
        </form>
      )}

      {editingFighter && (
        <FighterEditor
          key={editingFighter.id}
          fighter={editingFighter}
          onClose={() => setEditingId(null)}
        />
      )}

      {fighters.length === 0 ? (
        <p className="py-8 text-center text-sm text-neutral-500">
          Aucun fighter pour le moment. Ajoute le premier ou valide une
          candidature.
        </p>
      ) : (
        <div className="space-y-3">
          {fighters.map((f) => {
            const busy = busyId === f.id;

            return (
              <div
                key={f.id}
                className="flex flex-wrap items-center justify-between gap-4 rounded-md border border-white/10 bg-neutral-950 p-4"
              >
                <div className="flex items-center gap-4">
                  {f.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={f.photo_url}
                      alt={`${f.prenom} ${f.nom}`}
                      className="h-14 w-14 rounded-md object-cover"
                    />
                  )}

                  <div>
                    <p className="font-semibold text-white">
                      {f.prenom} {f.nom}
                    </p>

                    {f.surnom && (
                      <p className="text-sm text-neutral-400">"{f.surnom}"</p>
                    )}

                    {!f.is_active && (
                      <p className="text-xs text-red-400">Masqué</p>
                    )}

                    <p className="mt-1 text-xs text-neutral-500">
                      {f.combat} combat(s) · {f.victoire}V / {f.defaite}D /{" "}
                      {f.nul}N
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingId(f.id);
                    }}
                    disabled={busy}
                    className={btnOutline}
                  >
                    MODIFIER
                  </button>

                  <button
                    type="button"
                    onClick={() => remove(f)}
                    disabled={busy}
                    className={btnDanger}
                  >
                    SUPPRIMER
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
