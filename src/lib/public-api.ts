
import type { Fighter, FighterTier, WeightCategory } from "@/components/types/fighter";
import type { Article, ArticleCategory } from "@/components/types/article";
import type { ApiList, ArticleApi, FighterApi } from "@/components/types/api";
import { unwrap } from "@/lib/api";

// Lecture des données publiques de Laravel.
// À utiliser uniquement dans les Server Components.
const API_URL = process.env.API_URL;

async function fetchJson<T>(path: string): Promise<T | null> {
  try {
    if (!API_URL) {
      console.error("[public-api] La variable API_URL est manquante.");
      return null;
    }

    const response = await fetch(`${API_URL}${path}`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      console.warn(`[public-api] ${path} → HTTP ${response.status}`);
      return null;
    }

    return (await response.json()) as T;
  } catch (error) {
    console.error(`[public-api] ${path} injoignable`, error);
    return null;
  }
}

// // Correspondance entre catégories de poids et poids indicatifs en kg.
// const WEIGHT_KG: Record<WeightCategory, number> = {
//   Flyweight: 57,
//   Bantamweight: 61,
//   Featherweight: 66,
//   Lightweight: 70,
//   Welterweight: 77,
//   Middleweight: 84,
//   "Light Heavyweight": 93,
//   Heavyweight: 105,
// };

const WEIGHT_CATEGORIES: WeightCategory[] = [
  "Flyweight",
  "Bantamweight",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Light Heavyweight",
  "Heavyweight",
];

function toWeightCategory(value: string | null): WeightCategory {
  if (value && WEIGHT_CATEGORIES.includes(value as WeightCategory)) {
    return value as WeightCategory;
  }

  return "Flyweight";
}

// Correspondance entre le niveau enregistré dans Laravel
// et le niveau affiché publiquement.
function toTier(niveau: string | null): FighterTier {
  if (niveau === "professionnel") return "Professionnel";
  if (niveau === "avance") return "Semi-Pro";
  return "Amateur";
}

export function toFighter(f: FighterApi): Fighter {
  const weightCategory = toWeightCategory(f.weight_category ?? null);

  return {
    id: String(f.id),
    slug: String(f.id),
    fullName: `${f.prenom} ${f.nom}`.trim(),
    nickname: f.surnom || undefined,
    discipline: "MMA",
    weightCategory,
    weightKg: f.limite_categorie_kg ?? 0,
    tier: toTier(f.niveau ?? null),
    record: {
      wins: Number(f.victoire) || 0,
      losses: Number(f.defaite) || 0,
      draws: Number(f.nul) || 0,
      kos: Number(f.ko) || 0,
      submissions: Number(f.soumission) || 0,
    },
    bio: f.bio || f.apropos || "",
    fightingStyle: f.style_de_combat || "",
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

  const date = new Date(iso);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Africa/Dakar",
  });
}

// La base ne stockant pas encore de catégorie,
// on utilise provisoirement "Club".
export function toArticle(a: ArticleApi): Article {
  const paragraphs = (a.contenu ?? "")
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  const flat = paragraphs.join(" ");

  const category: ArticleCategory = "Club";

  return {
    id: String(a.id),
    slug: String(a.id),
    title: a.titre,
    category,
    date: longDate(a.date_publication ?? a.created_at ?? null),
    excerpt:
      flat.length > 160
        ? `${flat.slice(0, 157).trimEnd()}…`
        : flat,
    content: paragraphs,
    photos: (a.photos ?? [])
      .map((photo) => photo.url)
      .filter((url): url is string => Boolean(url)),
  };
}

// Fonctions utilisées par les pages du site.

export async function getFighters(): Promise<Fighter[]> {
  const payload = await fetchJson<ApiList<FighterApi>>("/fighters");
  return payload ? unwrap(payload).map(toFighter) : [];
}

export async function getFighter(id: string): Promise<Fighter | null> {
  const payload = await fetchJson<
    FighterApi | { data: FighterApi }
  >(`/fighters/${encodeURIComponent(id)}`);

  if (!payload) return null;

  return toFighter("data" in payload ? payload.data : payload);
}

export async function getArticles(): Promise<Article[]> {
  const payload = await fetchJson<ApiList<ArticleApi>>("/articles");
  return payload ? unwrap(payload).map(toArticle) : [];
}

export async function getArticle(id: string): Promise<Article | null> {
  const payload = await fetchJson<
    ArticleApi | { data: ArticleApi }
  >(`/articles/${encodeURIComponent(id)}`);

  if (!payload) return null;

  return toArticle("data" in payload ? payload.data : payload);
}
