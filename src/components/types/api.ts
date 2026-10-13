// Forme des données renvoyées par ton API Laravel.
// (Distinct de types/fighter.ts et types/article.ts, qui décrivent les données mockées du site public.)

export type ApiList<T> = T[] | { data: T[] };

export interface AdminUser {
  id: string;
  nom: string;
  prenom: string;
  mail: string;
}

export interface DemandeApi {
  id: string;
  reference_code: string | null;
  nom: string;
  prenom: string;
  tel: string;
  mail: string | null;
  date_naissance: string | null;
  ville: string | null;
  a_experience_combat: boolean | null;
  experience_niveau: string | null;
  annee_experience: number | null;
  motivation: string | null;
  comment_connu: string | null;
  status: string;
  created_at: string | null;
}

export interface FighterApi {
  id: string;
  nom: string;
  prenom: string;
  surnom: string | null;
  weight_category: string | null;
  niveau: string | null;
  combat: number;
  victoire: number;
  defaite: number;
  nul: number;
  ko: number;
  soumission: number;
  is_active: boolean;
}

export interface ArticleApi {
  id: string;
  titre: string;
  contenu: string;
  status: string;
  date_publication: string | null;
  created_at: string | null;
}
