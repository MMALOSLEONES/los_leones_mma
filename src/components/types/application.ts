export type SourceConnaissance =
  | "Instagram"
  | "TikTok"
  | "Facebook"
  | "WhatsApp"
  | "Recommandation"
  | "Google"
  | "Autre";

export interface ApplicationFormData {
  // Étape 1 — Informations
  prenom: string;
  nom: string;
  dateNaissance: string;
  telephone: string;
  email: string;
  ville: string;
  quartier: string;

  // Étape 2 — Profil sportif
  aExperienceCombat: boolean | null;
  niveau: string;
  aFaitCompetitions: boolean | null;
  nombreCombats: string;
  victoires: string;
  defaites: string;
  nuls: string;
  kos: string;
  soumissions: string;

  // Étape 3 — Photo
  commentConnu: SourceConnaissance | "";
  photo: File | null;

  // Étape 4 — Vérification
  consentAccepted: boolean;
}

export const initialApplicationData: ApplicationFormData = {
  prenom: "",
  nom: "",
  dateNaissance: "",
  telephone: "",
  email: "",
  ville: "",
  quartier: "",
  aExperienceCombat: null,
  niveau: "",
  aFaitCompetitions: null,
  nombreCombats: "",
  victoires: "",
  defaites: "",
  nuls: "",
  kos: "",
  soumissions: "",
  commentConnu: "",
  photo: null,
  consentAccepted: false,
};
