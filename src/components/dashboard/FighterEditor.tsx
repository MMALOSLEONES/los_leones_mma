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
import { adminRequest, adminUpload } from "@/lib/adminFetch";
import {
  MAX_PHOTOS,
  MAX_VIDEOS,
  uploadFighterVideo,
  videoFileError,
} from "@/lib/fighterMedia";
import { prepareImage } from "@/lib/image";
import { FIGHTER_LEVELS, WEIGHT_CATEGORIES } from "@/lib/labels";
import { parseWeight } from "@/lib/weight";
import type { FighterApi, FighterMediaApi } from "@/components/types/api";

type FormState = {
  prenom: string;
  nom: string;
  surnom: string;
  poids_kg: string;
  weight_category: string;
  niveau: string;
  reseaux: string;
  victoire: string;
  defaite: string;
  nul: string;
  ko: string;
  soumission: string;
  bio: string;
  style_de_combat: string;
  palmares: string;
  is_active: boolean;
};
type TextKey = Exclude<keyof FormState, "is_active">;

const toInt = (value: string) => Number.parseInt(value, 10) || 0;
const megaOctets = (bytes: number | null) =>
  bytes ? `${(bytes / 1024 / 1024).toFixed(1)} Mo` : "";

type Props = { fighter: FighterApi; onClose: () => void };

// Écran "Modifier un fighter" : informations + photos + vidéos.
// La liste des médias vient de `fighter` (donnée serveur) : après chaque action,
// router.refresh() recharge la page et la liste se met à jour toute seule.
export default function FighterEditor({ fighter, onClose }: Props) {
  const router = useRouter();

  // Le formulaire est rempli UNE fois, à l'ouverture : un rechargement
  // en arrière-plan ne doit pas effacer ce que l'admin est en train de taper.
  const [form, setForm] = useState<FormState>(() => ({
    prenom: fighter.prenom,
    nom: fighter.nom,
    surnom: fighter.surnom ?? "",
    poids_kg: fighter.poids_kg != null ? String(fighter.poids_kg) : "",
    weight_category: fighter.weight_category ?? "",
    niveau: fighter.niveau ?? "",
    reseaux: fighter.reseaux ?? "",
    victoire: String(fighter.victoire ?? 0),
    defaite: String(fighter.defaite ?? 0),
    nul: String(fighter.nul ?? 0),
    ko: String(fighter.ko ?? 0),
    soumission: String(fighter.soumission ?? 0),
    bio: fighter.bio ?? "",
    style_de_combat: fighter.style_de_combat ?? "",
    palmares: fighter.palmares ?? "",
    is_active: fighter.is_active,
  }));

  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState("");
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const media = fighter.media ?? [];
  const photos = media.filter((m) => m.type === "photo");
  const videos = media.filter((m) => m.type === "video");

  const setText = (key: TextKey) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // ─── Informations ───
  const save = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");

    if (form.poids_kg.trim() && parseWeight(form.poids_kg) === null) {
      setError("Poids invalide (exemple : 77 ou 77,5).");
      return;
    }

    setSaving(true);
    try {
      await adminRequest(`/fighters/${fighter.id}`, "PUT", {
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        surnom: form.surnom.trim() || null,
        poids_kg: parseWeight(form.poids_kg),
        // Vide = "Automatique" : Laravel déduit la catégorie du poids
        weight_category: form.weight_category || null,
        niveau: form.niveau || null,
        reseaux: form.reseaux.trim() || null,
        victoire: toInt(form.victoire),
        defaite: toInt(form.defaite),
        nul: toInt(form.nul),
        ko: toInt(form.ko),
        soumission: toInt(form.soumission),
        bio: form.bio.trim() || null,
        style_de_combat: form.style_de_combat.trim() || null,
        palmares: form.palmares.trim() || null,
        is_active: form.is_active,
      });
      setNotice("Modifications enregistrées.");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  // ─── Photos ───
  const addPhotos = async (files: File[]) => {
    if (files.length === 0) return;
    setError("");
    setNotice("");

    const room = MAX_PHOTOS - photos.length;
    if (room <= 0) {
      setError(`Maximum ${MAX_PHOTOS} photos par fighter.`);
      return;
    }

    const batch = files.slice(0, room);
    const problems: string[] = [];

    for (let i = 0; i < batch.length; i++) {
      setBusy(`Envoi de la photo ${i + 1}/${batch.length}...`);
      try {
        const prepared = await prepareImage(batch[i]);
        await adminUpload(`/fighters/${fighter.id}/photos`, prepared);
      } catch (err) {
        problems.push(
          `${batch[i].name} : ${err instanceof Error ? err.message : "échec"}`
        );
      }
    }
    if (files.length > room) {
      problems.push(`Seules ${room} photo(s) ont été prises en compte (maximum ${MAX_PHOTOS}).`);
    }

    setBusy("");
    if (problems.length > 0) setError(problems.join(" "));
    router.refresh();
  };

  const makeCover = async (photo: FighterMediaApi) => {
    setError("");
    setBusy("Mise à jour de la couverture...");
    try {
      await adminRequest(`/fighters/${fighter.id}/media/${photo.id}/cover`, "PUT");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Action impossible.");
    } finally {
      setBusy("");
    }
  };

  const removeMedia = async (item: FighterMediaApi) => {
    const label = item.type === "photo" ? "cette photo" : "cette vidéo";
    if (!window.confirm(`Supprimer ${label} définitivement ?`)) return;
    setError("");
    setBusy("Suppression...");
    try {
      await adminRequest(`/fighters/${fighter.id}/media/${item.id}`, "DELETE");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setBusy("");
    }
  };

  // ─── Vidéos ───
  const addVideo = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setNotice("");

    if (videos.length >= MAX_VIDEOS) {
      setError(`Maximum ${MAX_VIDEOS} vidéos par fighter.`);
      return;
    }
    const problem = videoFileError(file);
    if (problem) {
      setError(problem);
      return;
    }

    setProgress(0);
    setBusy("Envoi de la vidéo...");
    try {
      await uploadFighterVideo(fighter.id, file, setProgress);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Envoi impossible.");
    } finally {
      setBusy("");
      setProgress(null);
    }
  };

  const disabled = saving || Boolean(busy);

  return (
    <div className="mt-6 space-y-8 rounded-md border border-white/10 bg-neutral-950 p-5">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-bold tracking-widest text-orange-500">
          MODIFIER — {fighter.prenom} {fighter.nom}
        </p>
        <button type="button" onClick={onClose} className={btnOutline}>
          FERMER
        </button>
      </div>

      {error && (
        <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}
      {notice && (
        <div className="rounded-md border border-green-500/40 bg-green-500/10 px-4 py-3 text-sm text-green-400">
          {notice}
        </div>
      )}

      {/* ─── Informations ─── */}
      <form onSubmit={save} className="space-y-6">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <FormField label="Prénom" required value={form.prenom} onChange={setText("prenom")} />
          <FormField label="Nom" required value={form.nom} onChange={setText("nom")} />
          <FormField label="Surnom" value={form.surnom} onChange={setText("surnom")} />
          <FormField label="Réseaux (lien Instagram)" value={form.reseaux} onChange={setText("reseaux")} />
          <FormField
            label="Poids (kg)"
            inputMode="decimal"
            placeholder="77"
            value={form.poids_kg}
            onChange={setText("poids_kg")}
          />
          <SelectField
            label="Catégorie de poids"
            value={form.weight_category}
            onChange={setText("weight_category")}
            options={WEIGHT_CATEGORIES}
            placeholder="Automatique (selon le poids)"
          />
          <SelectField
            label="Niveau"
            value={form.niveau}
            onChange={setText("niveau")}
            options={FIGHTER_LEVELS}
            placeholder="Choisir..."
          />
        </div>

        <div>
          <p className="text-xs font-semibold tracking-widest text-neutral-400">RECORD</p>
          <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-5">
            <FormField label="Victoires" type="number" min={0} value={form.victoire} onChange={setText("victoire")} />
            <FormField label="Défaites" type="number" min={0} value={form.defaite} onChange={setText("defaite")} />
            <FormField label="Nuls" type="number" min={0} value={form.nul} onChange={setText("nul")} />
            <FormField label="KO" type="number" min={0} value={form.ko} onChange={setText("ko")} />
            <FormField label="Soumissions" type="number" min={0} value={form.soumission} onChange={setText("soumission")} />
          </div>
        </div>

        <TextAreaField label="Bio" rows={4} value={form.bio} onChange={setText("bio")} />
        <TextAreaField label="Style de combat" rows={3} value={form.style_de_combat} onChange={setText("style_de_combat")} />
        <TextAreaField label="Palmarès (une réalisation par ligne)" rows={4} value={form.palmares} onChange={setText("palmares")} />

        <label className="flex items-center gap-3 text-sm text-neutral-300">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={(e) => setForm((prev) => ({ ...prev, is_active: e.target.checked }))}
            className="h-4 w-4 accent-orange-500"
          />
          Visible sur le site
        </label>

        <button
          type="submit"
          disabled={disabled || !form.prenom.trim() || !form.nom.trim()}
          className={btnPrimary}
        >
          {saving ? "ENREGISTREMENT..." : "ENREGISTRER LES INFORMATIONS"}
        </button>
      </form>

      {/* ─── Photos ─── */}
      <div className="border-t border-white/10 pt-6">
        <p className="text-xs font-semibold tracking-widest text-neutral-400">
          PHOTOS ({photos.length}/{MAX_PHOTOS})
        </p>

        {photos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {photos.map((photo, index) => (
              <div key={photo.id} className="w-24">
                <div className="relative h-32 w-24 overflow-hidden rounded-md bg-neutral-900">
                  {photo.url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={photo.url} alt="" className="h-full w-full object-cover" />
                  )}
                  {index === 0 && (
                    <span className="absolute bottom-1 left-1 rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-black">
                      COUVERTURE
                    </span>
                  )}
                </div>
                <div className="mt-2 flex flex-col items-start gap-1">
                  {index !== 0 && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => makeCover(photo)}
                      className="text-left text-[11px] font-semibold text-neutral-300 hover:text-white disabled:opacity-40"
                    >
                      Mettre en couverture
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeMedia(photo)}
                    className="text-[11px] font-semibold text-red-400 hover:text-red-300 disabled:opacity-40"
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <label
          className={`${btnOutline} mt-4 inline-block cursor-pointer ${
            disabled || photos.length >= MAX_PHOTOS ? "pointer-events-none opacity-40" : ""
          }`}
        >
          AJOUTER DES PHOTOS
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            className="hidden"
            disabled={disabled || photos.length >= MAX_PHOTOS}
            onChange={(e) => {
              const files = Array.from(e.target.files ?? []);
              e.target.value = "";
              addPhotos(files);
            }}
          />
        </label>
        <p className="mt-2 text-xs text-neutral-500">
          La première photo est la photo principale de la fiche. Les photos sont réduites automatiquement.
        </p>
      </div>

      {/* ─── Vidéos ─── */}
      <div className="border-t border-white/10 pt-6">
        <p className="text-xs font-semibold tracking-widest text-neutral-400">
          VIDÉOS ({videos.length}/{MAX_VIDEOS})
        </p>

        {videos.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-4">
            {videos.map((video) => (
              <div key={video.id} className="w-56">
                {video.url && (
                  <video
                    src={video.url}
                    controls
                    preload="metadata"
                    playsInline
                    className="aspect-video w-full rounded-md bg-black"
                  />
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-[11px] text-neutral-500">{megaOctets(video.taille)}</span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeMedia(video)}
                    className={`${btnDanger} !px-0 !py-0 !text-[11px]`}
                  >
                    Retirer
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        <label
          className={`${btnOutline} mt-4 inline-block cursor-pointer ${
            disabled || videos.length >= MAX_VIDEOS ? "pointer-events-none opacity-40" : ""
          }`}
        >
          AJOUTER UNE VIDÉO
          <input
            type="file"
            accept="video/mp4,video/webm"
            className="hidden"
            disabled={disabled || videos.length >= MAX_VIDEOS}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = "";
              addVideo(file);
            }}
          />
        </label>
        <p className="mt-2 text-xs text-neutral-500">
          MP4 ou WebM, 150 Mo maximum. Compresse la vidéo avant de l&apos;envoyer (720p suffit).
        </p>

        {progress !== null && (
          <div className="mt-3 max-w-sm">
            <div className="h-2 w-full overflow-hidden rounded bg-white/10">
              <div className="h-full bg-orange-500 transition-all" style={{ width: `${progress}%` }} />
            </div>
            <p className="mt-1 text-xs text-neutral-400">{progress} %</p>
          </div>
        )}
      </div>

      {busy && progress === null && <p className="text-xs text-neutral-400">{busy}</p>}
    </div>
  );
}
