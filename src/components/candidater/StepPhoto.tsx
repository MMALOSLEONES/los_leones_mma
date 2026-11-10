"use client";

import { useEffect, useState, ChangeEvent, useRef } from "react";
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
  const photoInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  const [previews, setPreviews] = useState<string[]>([]);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");

  const MAX_PHOTOS = 10;
  const MAX_VIDEOS = 5;
  const MAX_VIDEO_SIZE_MB = 150;

  // Génère les aperçus dès que le tableau de photos change
  useEffect(() => {
    const objectUrls = data.photos.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    // Nettoyage de la mémoire à la destruction du composant
    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [data.photos]);

  // Traitement des images avec votre fonction prepareImage
  const handlePhotos = async (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError("");

    const filesArray = Array.from(e.target.files);

    if (data.photos.length + filesArray.length > MAX_PHOTOS) {
      setError(`Tu ne peux pas ajouter plus de ${MAX_PHOTOS} photos.`);
      e.target.value = "";
      return;
    }

    setProcessing(true);
    try {
      const preparedFiles: File[] = [];
      for (const file of filesArray) {
        const prepared = await prepareImage(file);
        preparedFiles.push(prepared);
      }
      update({ photos: [...data.photos, ...preparedFiles] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une de tes photos est impossible à utiliser.");
    } finally {
      setProcessing(false);
      e.target.value = "";
    }
  };

  // Traitement et vérification des vidéos
  const handleVideos = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setError("");

    const filesArray = Array.from(e.target.files);

    if (data.videos.length + filesArray.length > MAX_VIDEOS) {
      setError(`Tu ne peux pas ajouter plus de ${MAX_VIDEOS} vidéos.`);
      e.target.value = "";
      return;
    }

    const fileTooLarge = filesArray.some((file) => file.size / 1024 / 1024 > MAX_VIDEO_SIZE_MB);
    if (fileTooLarge) {
      setError(`Chaque vidéo doit faire moins de ${MAX_VIDEO_SIZE_MB} Mo.`);
      e.target.value = "";
      return;
    }

    update({ videos: [...data.videos, ...filesArray] });
    e.target.value = "";
  };

  const removePhoto = (indexToRemove: number) => {
    update({ photos: data.photos.filter((_, i) => i !== indexToRemove) });
  };

  const removeVideo = (indexToRemove: number) => {
    update({ videos: data.videos.filter((_, i) => i !== indexToRemove) });
  };

  return (
    <div>
      <h2 className="text-2xl font-extrabold text-white">03 — PHOTOS & VIDÉOS</h2>
      <p className="mt-2 text-sm text-neutral-400">
        Ajoute des photos de toi, de face, bien éclairées ainsi que des vidéos de tes sparrings ou combats (optionnel).
      </p>

      {error && <p className="mt-4 rounded-md bg-red-500/10 border border-red-500/20 px-4 py-3 text-xs text-red-400">{error}</p>}

      {/* --- SECTION DES PHOTOS (MAX 10) --- */}
      <div className="mt-8 space-y-4">
        <label className="block text-xs font-semibold tracking-widest text-neutral-400 uppercase">
          Photos choisies ({data.photos.length} / {MAX_PHOTOS})
        </label>
        
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {previews.map((url, index) => (
            <div key={index} className="relative aspect-[3/4] overflow-hidden rounded-md border border-white/10 bg-neutral-900">
              <img src={url} alt={`Aperçu ${index}`} className="h-full w-full object-cover" />
              {index === 0 && (
                <span className="absolute bottom-2 left-2 rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-black uppercase tracking-wider">
                  Couverture
                </span>
              )}
              <button
                type="button"
                onClick={() => removePhoto(index)}
                className="absolute right-2 top-2 rounded-full bg-black/80 px-2 py-0.5 text-xs text-white hover:bg-red-500 transition-colors"
              >
                ✕
              </button>
            </div>
          ))}

          {data.photos.length < MAX_PHOTOS && (
            <button
              type="button"
              disabled={processing}
              onClick={() => photoInputRef.current?.click()}
              className="flex aspect-[3/4] flex-col items-center justify-center rounded-md border border-dashed border-white/20 bg-neutral-900 text-center p-4 hover:border-white/40 transition-all disabled:opacity-50"
            >
              <span className="text-xl text-neutral-400">{processing ? "..." : "+"}</span>
              <span className="mt-1 text-xs font-semibold text-neutral-300">
                {processing ? "TRAITEMENT..." : "AJOUTER"}
              </span>
            </button>
          )}
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          className="hidden"
          onChange={handlePhotos}
        />
        <p className="text-[11px] text-neutral-500">JPG, PNG ou WebP. Elles sont réduites automatiquement.</p>
      </div>

      {/* --- SECTION DES VIDÉOS (MAX 5) --- */}
      <div className="mt-8 pt-6 border-t border-white/10 space-y-4">
        <label className="block text-xs font-semibold tracking-widest text-neutral-400 uppercase">
          Vidéos de sparring / combat ({data.videos.length} / {MAX_VIDEOS})
        </label>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {data.videos.map((file, index) => (
            <div key={index} className="relative flex items-center justify-between rounded-md border border-white/10 bg-neutral-900/60 p-3">
              <div className="flex items-center space-x-3 overflow-hidden pr-6">
                <span className="text-lg">🎬</span>
                <div className="overflow-hidden">
                  <p className="truncate text-xs font-medium text-white">{file.name}</p>
                  <p className="text-[10px] text-neutral-500">{(file.size / 1024 / 1024).toFixed(1)} Mo</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => removeVideo(index)}
                className="text-xs text-neutral-400 hover:text-red-400"
              >
                Retirer
              </button>
            </div>
          ))}

          {data.videos.length < MAX_VIDEOS && (
            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              className="flex h-14 items-center justify-center space-x-2 rounded-md border border-dashed border-white/20 bg-neutral-900 hover:border-white/40 transition-all"
            >
              <span className="text-md text-neutral-400">+</span>
              <span className="text-xs font-semibold text-neutral-300">AJOUTER UNE VIDÉO</span>
            </button>
          )}
        </div>
        <input
          ref={videoInputRef}
          type="file"
          accept="video/mp4,video/webm"
          multiple
          className="hidden"
          onChange={handleVideos}
        />
        <p className="text-[11px] text-neutral-500">MP4 ou WebM. Maximum {MAX_VIDEO_SIZE_MB} Mo par vidéo.</p>
      </div>

      {/* --- SOURCE DE CONNAISSANCE --- */}
      <div className="mt-8 pt-6 border-t border-white/10">
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

      {/* --- NAVIGATION --- */}
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
          disabled={data.photos.length === 0 || processing}
          className="rounded-md bg-orange-500 px-6 py-3 text-xs font-bold tracking-widest text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
        >
          CONTINUER
        </button>
      </div>
    </div>
  );
}
