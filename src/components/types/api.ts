// Forme des données renvoyées par ton API Laravel.
// (Distinct de types/fighter.ts et types/article.ts, qui décrivent ce que le site public affiche.)

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
  quartier: string | null;
  a_fait_competitions: boolean | null;
  nombre_combats: number | null;
  victoires: number | null;
  defaites: number | null;
  nuls: number | null;
  kos: number | null;
  soumissions: number | null;
  has_photo: boolean;
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
  reseaux: string | null;
  combat: number;
  victoire: number;
  defaite: number;
  nul: number;
  ko: number;
  soumission: number;
  apropos: string | null;
  style_de_combat: string | null;
  palmares: string | null;
  bio: string | null;
  photo: string | null;
  photo_url: string | null;
  is_active: boolean;
}

export interface ArticlePhotoApi {
  id: string;
  url: string | null;
  position: number;
}

export interface ArticleApi {
  photos: ArticlePhotoApi[];
  id: string;
  titre: string;
  contenu: string;
  status: string;
  date_publication: string | null;
  created_at: string | null;
}
