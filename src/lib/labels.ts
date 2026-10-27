export type Tone = "pending" | "success" | "danger" | "neutral";

// ⚠️ Valeurs à aligner sur celles de TA base (CHECK / enum de tes migrations).
// C'est le seul endroit à modifier si elles diffèrent.
export const DEMANDE_STATUS: Record<string, { label: string; tone: Tone }> = {
  en_attente_paiement: { label: "En attente", tone: "pending" },
  paye: { label: "Payée", tone: "pending" },
  approuve: { label: "Approuvée", tone: "success" },
  refuse: { label: "Refusée", tone: "danger" },
};

export function demandeStatus(status: string): { label: string; tone: Tone } {
  return DEMANDE_STATUS[status] ?? { label: status, tone: "neutral" };
}

// Une candidature "ouverte" attend encore une décision
export const isOpenDemande = (status: string) =>
  status !== "approuve" && status !== "refuse";

export const ARTICLE_STATUS: { value: string; label: string; tone: Tone }[] = [
  { value: "draft", label: "Brouillon", tone: "neutral" },
  { value: "publie", label: "Publié", tone: "success" },
];

export function articleStatus(status: string): { label: string; tone: Tone } {
  return (
    ARTICLE_STATUS.find((s) => s.value === status) ?? {
      label: status,
      tone: "neutral",
    }
  );
}

export const FIGHTER_LEVELS = [
  { value: "debutant", label: "Débutant" },
  { value: "intermediaire", label: "Intermédiaire" },
  { value: "avance", label: "Avancé" },
  { value: "professionnel", label: "Professionnel" },
];

export const WEIGHT_CATEGORIES = [
  "Flyweight",
  "Bantamweight",
  "Featherweight",
  "Lightweight",
  "Welterweight",
  "Middleweight",
  "Light Heavyweight",
  "Heavyweight",
].map((c) => ({ value: c, label: c }));

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    timeZone: "Africa/Dakar",
  });
}
