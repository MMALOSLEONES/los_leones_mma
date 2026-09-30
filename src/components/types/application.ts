export type ObjectifCandidature =
  | "Apprendre le MMA"
  | "Améliorer ma condition physique"
  | "Faire de la compétition"
  | "Devenir professionnel"
  | "Préparer un combat"
  | "Développer mes compétences"
  | "Autre";

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
  discipline: string;
  anneesPratique: string;
  niveau: string;
  aFaitCompetitions: boolean | null;
  nombreCombats: string;
  victoires: string;
  defaites: string;
  nuls: string;
  kos: string;
  soumissions: string;

  // Étape 3 — Motivation
  motivation: string;
  objectifs: ObjectifCandidature[];
  commentConnu: SourceConnaissance | "";
  photoFileName: string;

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
  discipline: "",
  anneesPratique: "",
  niveau: "",
  aFaitCompetitions: null,
  nombreCombats: "",
  victoires: "",
  defaites: "",
  nuls: "",
  kos: "",
  soumissions: "",
  motivation: "",
  objectifs: [],
  commentConnu: "",
  photoFileName: "",
  consentAccepted: false,
};
