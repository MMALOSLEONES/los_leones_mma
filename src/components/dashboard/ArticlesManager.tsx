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
import StatusBadge from "@/components/dashboard/StatusBadge";
import { adminRequest } from "@/lib/adminFetch";
import { ARTICLE_STATUS, articleStatus, formatDate } from "@/lib/labels";
import type { ArticleApi } from "@/components/types/api";

type Editing = ArticleApi | "new" | null;

export default function ArticlesManager({ articles }: { articles: ArticleApi[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Editing>(null);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [status, setStatus] = useState(ARTICLE_STATUS[0].value);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const openNew = () => {
    setEditing("new");
    setTitre("");
    setContenu("");
    setStatus(ARTICLE_STATUS[0].value);
    setError("");
  };

  const openEdit = (article: ArticleApi) => {
    setEditing(article);
    setTitre(article.titre);
    setContenu(article.contenu);
    setStatus(article.status);
    setError("");
  };

  const save = async (e: FormEvent) => {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");

    // Publié : on garde la date d'origine si elle existe, sinon c'est maintenant
    const existingDate = editing !== "new" ? editing.date_publication : null;
    const payload = {
      titre: titre.trim(),
      contenu: contenu.trim(),
      status,
      date_publication:
        status === "publie" ? (existingDate ?? new Date().toISOString()) : null,
    };

    try {
      if (editing === "new") {
        await adminRequest("/articles", "POST", payload);
      } else {
        await adminRequest(`/articles/${editing.id}`, "PUT", payload);
      }
      setEditing(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Enregistrement impossible.");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (article: ArticleApi) => {
    if (!window.confirm(`Supprimer l'article « ${article.titre} » ?`)) return;
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
          <SelectField
            label="Statut"
            value={status}
            onChange={setStatus}
            options={ARTICLE_STATUS}
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving || !titre.trim() || !contenu.trim()}
              className={btnPrimary}
            >
              {saving ? "ENREGISTREMENT..." : "ENREGISTRER"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className={btnOutline}>
              ANNULER
            </button>
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
            return (
              <li key={a.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate font-bold text-white">{a.titre}</p>
                  <p className="mt-1 text-xs text-neutral-500">
                    {a.date_publication
                      ? `Publié le ${formatDate(a.date_publication)}`
                      : `Créé le ${formatDate(a.created_at)}`}
                  </p>
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
