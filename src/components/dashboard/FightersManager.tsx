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
import PhotoPicker from "@/components/dashboard/PhotoPicker";
import { adminRequest, adminUpload } from "@/lib/adminFetch";
import { prepareImage } from "@/lib/image";
import { FIGHTER_LEVELS, WEIGHT_CATEGORIES } from "@/lib/labels";
import type { FighterApi } from "@/components/types/api";

const emptyForm = {
  prenom: "",
  nom: "",
  surnom: "",
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

export default function FightersManager({ fighters }: { fighters: FighterApi[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [photo, setPhoto] = useState<File | null>(null);
  const [pickerKey, setPickerKey] = useState(0);
  const [saving, setSaving] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const set = (key: keyof FormState) => (value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const resetForm = () => {
    setForm(emptyForm);
    setPhoto(null);
    setPickerKey((k) => k + 1); // vide le sélecteur de photo
    setShowForm(false);
  };

  const create = async (e: FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    let created = false;
    try {
      // 1) Le fighter
      const result = await adminRequest<{ data?: { id?: string }; id?: string }>("/fighters", "POST", {
        prenom: form.prenom.trim(),
        nom: form.nom.trim(),
        surnom: form.surnom.trim() || null,
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
      created = true;

      // 2) Sa photo, avec l'identifiant qu'on vient de recevoir
      if (photo) {
        const fighterId = result.data?.id ?? result.id;
        if (!fighterId) throw new Error("identifiant du fighter introuvable");
        await adminUpload(`/fighters/${fighterId}/photo`, photo);
      }

      resetForm();
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Ajout impossible.";
      if (created) {
        // Le fighter existe : on ferme le formulaire (le ré-envoyer créerait un doublon)
        setError(
          `Fighter ajouté, mais la photo n'a pas pu être envoyée : ${message}. Utilise « Ajouter une photo » dans la liste.`
        );
        resetForm();
        router.refresh();
      } else {
        setError(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const changePhoto = async (fighter: FighterApi, file: File) => {
    setBusyId(fighter.id);
    setError("");
    try {
      const prepared = await prepareImage(file);
      await adminUpload(`/fighters/${fighter.id}/photo`, prepared);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Photo impossible à envoyer.");
    } finally {
      setBusyId(null);
    }
  };

  const remove = async (fighter: FighterApi) => {
    if (!window.confirm(`Supprimer ${fighter.prenom} ${fighter.nom} définitivement ?`)) return;
    setBusyId(fighter.id);
    setError("");
    try {
      await adminRequest(`/fighters/${fighter.id}`, "DELETE");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setBusyId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">
          {fighters.length} fighter{fighters.length > 1 ? "s" : ""}
        </p>
        <button onClick={() => (showForm ? resetForm() : setShowForm(true))} className={btnPrimary}>
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
          className="mt-6 space-y-6 rounded-md border border-white/10 bg-neutral-950 p-5"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <FormField label="Prénom" required value={form.prenom} onChange={set("prenom")} />
            <FormField label="Nom" required value={form.nom} onChange={set("nom")} />
            <FormField label="Surnom" value={form.surnom} onChange={set("surnom")} />
            <FormField label="Réseaux (lien Instagram)" value={form.reseaux} onChange={set("reseaux")} />
            <SelectField
              label="Catégorie de poids"
              value={form.weight_category}
              onChange={set("weight_category")}
              options={WEIGHT_CATEGORIES}
              placeholder="Choisir..."
            />
            <SelectField
              label="Niveau"
              value={form.niveau}
              onChange={set("niveau")}
              options={FIGHTER_LEVELS}
              placeholder="Choisir..."
            />
          </div>

          <PhotoPicker key={pickerKey} label="Photo" onChange={(files) => setPhoto(files[0] ?? null)} />

          <div>
            <p className="text-xs font-semibold tracking-widest text-neutral-400">RECORD</p>
            <div className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-5">
              <FormField label="Victoires" type="number" min={0} value={form.victoire} onChange={set("victoire")} />
              <FormField label="Défaites" type="number" min={0} value={form.defaite} onChange={set("defaite")} />
              <FormField label="Nuls" type="number" min={0} value={form.nul} onChange={set("nul")} />
              <FormField label="KO" type="number" min={0} value={form.ko} onChange={set("ko")} />
              <FormField label="Soumissions" type="number" min={0} value={form.soumission} onChange={set("soumission")} />
            </div>
          </div>

          <TextAreaField label="Bio" rows={4} value={form.bio} onChange={set("bio")} />
          <TextAreaField label="Style de combat" rows={3} value={form.style_de_combat} onChange={set("style_de_combat")} />
          <TextAreaField label="Palmarès (une réalisation par ligne)" rows={4} value={form.palmares} onChange={set("palmares")} />

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !form.prenom.trim() || !form.nom.trim()}
              className={btnPrimary}
            >
              {saving ? "ENREGISTREMENT..." : "ENREGISTRER"}
            </button>
            <button type="button" onClick={resetForm} disabled={saving} className={btnOutline}>
              ANNULER
            </button>
          </div>
        </form>
      )}

      {fighters.length === 0 ? (
        <p className="mt-10 text-center text-neutral-500">
          Aucun fighter pour le moment. Ajoute le premier ou valide une candidature.
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-white/10 rounded-md border border-white/10 bg-neutral-950">
          {fighters.map((f) => (
            <li key={f.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="flex items-center gap-4">
                <div className="h-16 w-12 shrink-0 overflow-hidden rounded-md bg-neutral-900">
                  {f.photo_url && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={f.photo_url} alt="" className="h-full w-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-white">
                    {f.prenom} {f.nom}
                    {f.surnom && (
                      <span className="ml-2 text-sm font-semibold italic text-orange-500">
                        &quot;{f.surnom}&quot;
                      </span>
                    )}
                    {!f.is_active && (
                      <span className="ml-2 text-[10px] font-bold tracking-widest text-neutral-500">
                        INACTIF
                      </span>
                    )}
                  </p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {f.weight_category ?? "Catégorie non définie"} · {f.victoire}-{f.defaite}-{f.nul}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <label
                  className={`${btnOutline} cursor-pointer ${busyId === f.id ? "pointer-events-none opacity-40" : ""}`}
                >
                  {f.photo_url ? "CHANGER LA PHOTO" : "AJOUTER UNE PHOTO"}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={busyId === f.id}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      e.target.value = "";
                      if (file) changePhoto(f, file);
                    }}
                  />
                </label>
                <button onClick={() => remove(f)} disabled={busyId === f.id} className={btnDanger}>
                  Supprimer
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
