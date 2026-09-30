export type ArticleCategory =
  | "Combat"
  | "Résultat"
  | "Événement"
  | "Entraînement"
  | "Club";

export interface Article {
  id: string;
  slug: string;
  title: string;
  category: ArticleCategory;
  date: string;
  excerpt: string;
  content: string[];
}
