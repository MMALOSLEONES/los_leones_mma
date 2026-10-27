"use client";

import { useEffect, useState } from "react";
import type {
  ApplicationFormData,
  SourceConnaissance,
} from "@/components/types/application";
import { prepareImage } from "@/lib/image";

type Props = {
  data: ApplicationFormData;
  update: (fields: Partial<ApplicationFormData>) => void;
  onNext: () => void;
  onBack: () => void;
};

const sources: SourceConnaissance[] = [
  "Instagram",
  "TikTok",
  "Facebook",
  "WhatsApp",
  "Recommandation",
  "Google",
  "Autre",
];

export default function StepPhoto({ data, update, onNext, onBack }: Props) {
  const [preview, setPreview] = useState<string | null>(() =>
    data.photo ? URL.createObjectURL(data.photo) : null
  );
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  // Libère l'ancien aperçu quand il change, et quand on quitte l'étape
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleFile = async (file: File | undefined) => {
    if (!file) return;
    setError("");
    setProcessing(true);
    try {
      const prepared = await prepareImage(file);
      update({ photo: prepared });
      setPreview(URL.createObjectURL(prepared));
    } catch (err) {
      update({ photo: null });
      setPreview(null);
      setError(err instanceof Error ? err.message : "Photo impossible à utiliser.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">03 — PHOTO</h2>
      <p className="mt-2 text-sm text-neutral-400">
        Ajoute une photo de toi, de face, bien éclairée. Elle sera vue par
        l&apos;équipe Los Leones pour étudier ton dossier.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <div className="flex h-48 w-36 items-center justify-center overflow-hidden rounded-md border border-dashed border-white/20 bg-neutral-900">
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="Aperçu de ta photo" className="h-full w-full object-cover" />
          ) : (
            <span className="px-3 text-center text-xs text-neutral-500">Aucune photo</span>
          )}
        </div>

        <div>
          <label className="inline-block cursor-pointer rounded-md border border-white/20 px-4 py-3 text-xs font-semibold tracking-wide text-white hover:border-white/40">
            {processing ? "TRAITEMENT..." : data.photo ? "CHANGER DE PHOTO" : "CHOISIR UNE PHOTO"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              disabled={processing}
              onChange={(e) => {
                const file = e.target.files?.[0];
                e.target.value = ""; // permet de re-choisir le même fichier
                handleFile(file);
              }}
            />
          </label>
          <p className="mt-2 text-xs text-neutral-500">JPG, PNG ou WebP. Elle est réduite automatiquement.</p>
          {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
        </div>
      </div>

      <div className="mt-8">
        <label className="block text-xs font-semibold tracking-widest text-neutral-400">
          COMMENT AS-TU CONNU LOS LEONES ? (OPTIONNEL)
        </label>
        <select
          value={data.commentConnu}
          onChange={(e) => update({ commentConnu: e.target.value as SourceConnaissance })}
          className="mt-2 w-full rounded-md border border-white/15 bg-neutral-900 px-4 py-3 text-sm text-white focus:border-orange-500 focus:outline-none sm:max-w-xs"
        >
          <option value="">Choisir...</option>
          {sources.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
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
          disabled={!data.photo || processing}
          className="rounded-md bg-orange-500 px-6 py-3 text-xs font-bold tracking-widest text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          CONTINUER
        </button>
      </div>
    </div>
  );
}
