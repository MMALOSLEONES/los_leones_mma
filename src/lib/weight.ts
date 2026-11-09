// Règles du champ "poids" du formulaire de candidature.
// Elles sont refaites côté Laravel : ici elles guident la personne,
// là-bas elles servent de vraie barrière.

export const MIN_WEIGHT_KG = 40;
export const MAX_WEIGHT_KG = 200;

// Accepte "77", "77,5" et "77.5". Renvoie null si le format est invalide.
export function parseWeight(raw: string): number | null {
  const value = raw.trim().replace(",", ".");
  if (!/^\d{2,3}(\.\d)?$/.test(value)) return null;
  return Number(value);
}

// On renvoie un CODE et non un texte : chaque langue affiche son propre message.
export type WeightErrorCode = "format" | "range";

export function weightErrorCode(raw: string): WeightErrorCode | null {
  if (!raw.trim()) return null; // champ vide : pas de message, le bouton reste bloqué
  const kg = parseWeight(raw);
  if (kg === null) return "format";
  if (kg < MIN_WEIGHT_KG || kg > MAX_WEIGHT_KG) return "range";
  return null;
}
