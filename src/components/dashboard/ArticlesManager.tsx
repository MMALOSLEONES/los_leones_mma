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
import StatusBadge from "@/components/dashboard/StatusBadge";
import { adminRequest, adminUpload } from "@/lib/adminFetch";
import { ARTICLE_STATUS, articleStatus, formatDate } from "@/lib/labels";
import type { ArticleApi, ArticlePhotoApi } from "@/components/types/api";

type Editing = ArticleApi | "new" | null;

export default function ArticlesManager({ articles }: { articles: ArticleApi[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [status, setStatus] = useState(ARTICLE_STATUS[0].value);
  const [newPhotos, setNewPhotos] = useState<File[]>([]);
  const [pickerKey, setPickerKey] = useState(0);
  const [progress, setProgress] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const resetPhotos = () => {
    setNewPhotos([]);
    setPickerKey((k) => k + 1); // vide le sélecteur
  };

  const closeForm = () => {
    setEditing(null);
    resetPhotos();
  };

  const openNew = () => {
    setEditing("new");
    setTitre("");
    setContenu("");
    setStatus(ARTICLE_STATUS[0].value);
    resetPhotos();
    setError("");
  };

  const openEdit = (article: ArticleApi) => {
    setEditing(article);
    setTitre(article.titre);
    setContenu(article.contenu);
    setStatus(article.status);
    resetPhotos();
    setError("");
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    setProgress("");

    // Publié : on garde la date d'origine si elle existe, sinon c'est maintenant
    const existingDate = editing !== "new" ? editing.date_publication : null;
    const payload = {
      titre: titre.trim(),
      contenu: contenu.trim(),
      status,
      date_publication:
        status === "publie" ? (existingDate ?? new Date().toISOString()) : null,
    };

    let createdNew = false;
    try {
      // 1) Le texte
      let articleId: string;
      if (editing === "new") {
        const created = await adminRequest<{ data?: { id?: string } }>("/articles", "POST", payload);
        createdNew = true;
        if (!created.data?.id) {
          throw new Error("Article créé, mais son identifiant est introuvable pour joindre les photos.");
        }
        articleId = created.data.id;
      } else {
        await adminRequest(`/articles/${editing.id}`, "PUT", payload);
        articleId = editing.id;
      }

      // 2) Les photos, une par requête, dans l'ordre choisi
      for (let i = 0; i < newPhotos.length; i++) {
        setProgress(`Envoi des photos ${i + 1}/${newPhotos.length}...`);
        try {
          await adminUpload(`/articles/${articleId}/photos`, newPhotos[i]);
        } catch (err) {
          const reason = err instanceof Error ? err.message : "erreur";
          throw new Error(
            `Article enregistré, mais la photo ${i + 1} n'a pas pu être envoyée : ${reason}. Tu peux la rajouter en modifiant l'article.`
          );
        }
      }

      closeForm();
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible.");
      // Si l'article vient d'être créé, on ferme le formulaire : y rester
      // et ré-enregistrer créerait un doublon.
      if (createdNew) {
        closeForm();
        router.refresh();
      }
    } finally {
      setSaving(false);
      setProgress("");
    }
  };

  const removeExistingPhoto = async (article: ArticleApi, photo: ArticlePhotoApi) => {
    if (!window.confirm("Retirer cette photo de l'article ?")) return;
    setError("");
    try {
      await adminRequest(`/articles/${article.id}/photos/${photo.id}`, "DELETE");
      // On met à jour l'aperçu du formulaire sans le fermer
      setEditing({ ...article, photos: article.photos.filter((p) => p.id !== photo.id) });
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    }
  };

  const remove = async (article: ArticleApi) => {
    if (!window.confirm(`Supprimer l'article « ${article.titre} » et ses photos ?`)) return;
    setDeletingId(article.id);
    setError("");
    try {
      await adminRequest(`/articles/${article.id}`, "DELETE");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Suppression impossible.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-neutral-400">
          {articles.length} article{articles.length > 1 ? "s" : ""}
        </p>
        {editing === null && (
          <button onClick={openNew} className={btnPrimary}>
            NOUVEL ARTICLE
          </button>
        )}
      </div>

      {error && (
        <div className="mt-6 rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {error}
        </div>
      )}

      {editing !== null && (
        <form
          onSubmit={save}
          className="mt-6 space-y-5 rounded-md border border-white/10 bg-neutral-950 p-5"
        >
          <p className="text-xs font-bold tracking-widest text-orange-500">
            {editing === "new" ? "NOUVEL ARTICLE" : "MODIFIER L'ARTICLE"}
          </p>
          <FormField label="Titre" required value={titre} onChange={setTitre} />
          <TextAreaField label="Contenu" required rows={10} value={contenu} onChange={setContenu} />

          {editing !== "new" && editing.photos.length > 0 && (
            <div>
              <p className="text-xs font-semibold tracking-widest text-neutral-400">
                PHOTOS ACTUELLES
              </p>
              <div className="mt-3 flex flex-wrap gap-3">
                {editing.photos.map((photo, index) => (
                  <div key={photo.id} className="relative">
                    {photo.url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={photo.url} alt="" className="h-24 w-20 rounded-md object-cover" />
                    )}
                    {index === 0 && (
                      <span className="absolute bottom-1 left-1 rounded bg-orange-500 px-1.5 py-0.5 text-[9px] font-bold text-black">
                        COUVERTURE
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => removeExistingPhoto(editing, photo)}
                      aria-label="Retirer cette photo"
                      className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-black text-xs text-white ring-1 ring-white/30 hover:bg-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <PhotoPicker
            key={pickerKey}
            multiple
            max={10}
            label={editing === "new" ? "Photos" : "Ajouter des photos"}
            onChange={setNewPhotos}
          />

          <SelectField label="Statut" value={status} onChange={setStatus} options={ARTICLE_STATUS} />

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving || !titre.trim() || !contenu.trim()}
              className={btnPrimary}
            >
              {saving ? "ENREGISTREMENT..." : "ENREGISTRER"}
            </button>
            <button type="button" onClick={closeForm} disabled={saving} className={btnOutline}>
              ANNULER
            </button>
            {progress && <span className="text-xs text-neutral-400">{progress}</span>}
          </div>
        </form>
      )}

      {articles.length === 0 ? (
        <p className="mt-10 text-center text-neutral-500">
          Aucun article pour le moment. Écris le premier avec « Nouvel article ».
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-white/10 rounded-md border border-white/10 bg-neutral-950">
          {articles.map((a) => {
            const s = articleStatus(a.status);
            const cover = a.photos[0]?.url;
            return (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="flex min-w-0 items-center gap-4">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-md bg-neutral-900">
                    {cover && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={cover} alt="" className="h-full w-full object-cover" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-white">{a.titre}</p>
                    <p className="mt-1 text-xs text-neutral-500">
                      {a.photos.length} photo{a.photos.length > 1 ? "s" : ""} ·{" "}
                      {a.date_publication
                        ? `Publié le ${formatDate(a.date_publication)}`
                        : `Créé le ${formatDate(a.created_at)}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge label={s.label} tone={s.tone} />
                  <button onClick={() => openEdit(a)} className={btnOutline}>
                    MODIFIER
                  </button>
                  <button
                    onClick={() => remove(a)}
                    disabled={deletingId === a.id}
                    className={btnDanger}
                  >
                    Supprimer
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
