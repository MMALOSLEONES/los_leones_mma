import type { Fighter, FighterTier } from "@/components/types/fighter";
import type { Article } from "@/components/types/article";
import type { ApiList, ArticleApi, FighterApi } from "@/components/types/api";
import { unwrap } from "@/lib/api";

// Lecture des données PUBLIQUES de Laravel (aucun token nécessaire).
// À utiliser uniquement dans des Server Components : API_URL reste côté serveur.
const API_URL = process.env.API_URL;

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      // Données toujours fraîches pendant le développement.
      // En production, tu pourras remplacer par : next: { revalidate: 60 }
      cache: "no-store",
    });
    if (!response.ok) {
      console.warn(`[public-api] ${path} → HTTP ${response.status}`);
      return null;
    }
    return (await response.json()) as T;
  } catch (error) {
    // Laravel éteint : le site reste en ligne, avec des listes vides
    console.error(`[public-api] ${path} injoignable`, error);
    return null;
  }
}

// ─── Adaptateurs : forme de la base → forme attendue par tes composants ───
// Les composants du site (FighterCard, ArticleCard...) restent inchangés.

// Limites indicatives, à ajuster. Elles servent à afficher "77 KG" sous la catégorie.
const WEIGHT_KG: Record<string, number> = {
  Flyweight: 57,
  Bantamweight: 61,
  Featherweight: 66,
  Lightweight: 70,
  Welterweight: 77,
  Middleweight: 84,
  "Light Heavyweight": 93,
  Heavyweight: 105,
};

// Le dashboard enregistre un niveau (debutant → professionnel),
// la page /fighters filtre sur 3 niveaux. Cette correspondance est un choix
// d'affichage : modifie-la ici si ton père préfère un autre découpage.
function toTier(niveau: string | null): FighterTier {
  if (niveau === "professionnel") return "Professionnel";
  if (niveau === "avance") return "Semi-Pro";
  return "Amateur";
}

export function toFighter(f: FighterApi): Fighter {
  return {
    id: f.id,
    slug: f.id, // l'URL du profil utilise l'identifiant
    fullName: `${f.prenom} ${f.nom}`.trim(),
    nickname: f.surnom || undefined,
    discipline: "MMA",
    weightCategory: f.weight_category ?? "À définir",
    weightKg: f.weight_category ? (WEIGHT_KG[f.weight_category] ?? 0) : 0,
    tier: toTier(f.niveau),
    record: {
      wins: Number(f.victoire) || 0,
      losses: Number(f.defaite) || 0,
      draws: Number(f.nul) || 0,
      kos: Number(f.ko) || 0,
      submissions: Number(f.soumission) || 0,
    },
    bio: f.bio || f.apropos || "",
    fightingStyle: f.style_de_combat || "",
    // Une réalisation par ligne dans le champ "palmarès"
    achievements: (f.palmares ?? "")
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
    photoUrl: f.photo_url ?? undefined,
    instagram: f.reseaux || undefined,
  };
}

function longDate(iso: string | null): string {
  if (!iso) return "";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Dakar",
  });
}

export function toArticle(a: ArticleApi): Article {
  // Une ligne vide dans le texte = un nouveau paragraphe
  const paragraphs = a.contenu
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
  const flat = paragraphs.join(" ");

  return {
    id: a.id,
    slug: a.id,
    title: a.titre,
    category: "Actualité", // la base ne stocke pas de catégorie
    date: longDate(a.date_publication ?? a.created_at),
    excerpt: flat.length > 160 ? `${flat.slice(0, 157).trimEnd()}…` : flat,
    content: paragraphs,
    photos: (a.photos ?? [])
      .map((p) => p.url)
      .filter((url): url is string => Boolean(url)),
  };
}

// ─── Fonctions à appeler depuis les pages ───

export async function getFighters(): Promise<Fighter[]> {
  const payload = await fetchJson<ApiList<FighterApi>>("/fighters");
  return payload ? unwrap(payload).map(toFighter) : [];
}

export async function getFighter(id: string): Promise<Fighter | null> {
  const payload = await fetchJson<FighterApi | { data: FighterApi }>(
    `/fighters/${encodeURIComponent(id)}`,
  );
  if (!payload) return null;
  return toFighter("data" in payload ? payload.data : payload);
}

export async function getArticles(): Promise<Article[]> {
  const payload = await fetchJson<ApiList<ArticleApi>>("/articles");
  return payload ? unwrap(payload).map(toArticle) : [];
}

export async function getArticle(id: string): Promise<Article | null> {
  const payload = await fetchJson<ArticleApi | { data: ArticleApi }>(
    `/articles/${encodeURIComponent(id)}`,
  );
  if (!payload) return null;
  return toArticle("data" in payload ? payload.data : payload);
}
