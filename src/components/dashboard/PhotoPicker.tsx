"use client";

import { useEffect, useRef, useState } from "react";
import { btnOutline } from "@/components/dashboard/fields";
import { prepareImage } from "@/lib/image";

type Item = { file: File; url: string };

type Props = {
  multiple?: boolean;
  max?: number;
  label?: string;
  onChange: (files: File[]) => void;
};

// Choisit une ou plusieurs photos, les réduit dans le navigateur, montre un aperçu.
// Pour la vider (après un enregistrement), le parent change sa "key".
export default function PhotoPicker({ multiple = false, max = 10, label, onChange }: Props) {
  const [items, setItems] = useState<Item[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const itemsRef = useRef<Item[]>([]);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);

  // Libère la mémoire des aperçus quand le composant disparaît
  useEffect(() => {
    return () => itemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
  }, []);

  const commit = (next: Item[]) => {
    setItems(next);
    onChange(next.map((item) => item.file));
  };

  const canAdd = !busy && (multiple ? items.length < max : true);

  const handleFiles = async (files: File[]) => {
    if (files.length === 0) return;
    setError("");
    setBusy(true);

    const room = multiple ? Math.max(0, max - items.length) : 1;
    const added: Item[] = [];
    const problems: string[] = [];

    for (const file of files.slice(0, room)) {
      try {
        const prepared = await prepareImage(file);
        added.push({ file: prepared, url: URL.createObjectURL(prepared) });
      } catch (err) {
        problems.push(`${file.name} : ${err instanceof Error ? err.message : "illisible"}`);
      }
    }
    if (multiple && files.length > room) problems.push(`Maximum ${max} photos.`);

    if (multiple) {
      commit([...items, ...added]);
    } else if (added.length > 0) {
      items.forEach((item) => URL.revokeObjectURL(item.url));
      commit(added);
    }

    if (problems.length > 0) setError(problems.join(" "));
    setBusy(false);
  };

  const remove = (index: number) => {
    URL.revokeObjectURL(items[index].url);
    commit(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      {label && (
        <p className="text-xs font-semibold tracking-widest text-neutral-400">
          {label.toUpperCase()}
        </p>
      )}

      {items.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-3">
          {items.map((item, index) => (
            <div key={item.url} className="relative">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="h-24 w-20 rounded-md object-cover" />
              {multiple && index === 0 && (
                <span className="absolute bottom-1 left-1 rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-black">
                  COUVERTURE
                </span>
              )}
              <button
                type="button"
                onClick={() => remove(index)}
                aria-label="Retirer cette photo"
                className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white ring-1 ring-white/30 hover:bg-red-600"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <label
        className={`${btnOutline} mt-3 inline-block cursor-pointer ${
          canAdd ? "" : "pointer-events-none opacity-40"
        }`}
      >
        {busy
          ? "TRAITEMENT..."
          : multiple
            ? "AJOUTER DES PHOTOS"
            : items.length > 0
              ? "CHANGER LA PHOTO"
              : "CHOISIR UNE PHOTO"}
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple={multiple}
          className="hidden"
          disabled={!canAdd}
          onChange={(e) => {
            const files = Array.from(e.target.files ?? []);
            e.target.value = ""; // permet de re-choisir le même fichier
            handleFiles(files);
          }}
        />
      </label>
      <p className="mt-2 text-xs text-neutral-500">
        JPG, PNG ou WebP. Les photos sont réduites automatiquement.
        {multiple && " La première est la photo de couverture."}
      </p>
      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
