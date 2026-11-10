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
  poidsKg: string;

  // Étape 3 — Médias (Modifié pour le support multi-fichiers)
  commentConnu: SourceConnaissance | "";
  photos: File[]; // Remplace 'photo: File | null' pour stocker jusqu'à 10 photos
  videos: File[]; // Ajout pour stocker jusqu'à 5 vidéos d'entraînement/sparring

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
  poidsKg: "",
  soumissions: "",
  commentConnu: "",
  photos: [], // Tableau vide initialisé pour les photos
  videos: [], // Tableau vide initialisé pour les vidéos
  consentAccepted: false,
};
