// Règles de validation du formulaire de candidature.
// Elles sont REFAITES côté Laravel (StoreCandidatureRequest) : ici elles servent
// à guider la personne, là-bas elles servent de vraie barrière.

export const MIN_AGE = 18;

export function ageFromBirthDate(iso: string, today: Date = new Date()): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  // Refuse les dates impossibles (31 février...)
  const birth = new Date(year, month - 1, day);
  if (
    birth.getFullYear() !== year ||
    birth.getMonth() !== month - 1 ||
    birth.getDate() !== day
  ) {
    return null;
  }

  let age = today.getFullYear() - year;
  const birthdayPassed =
    today.getMonth() > month - 1 ||
    (today.getMonth() === month - 1 && today.getDate() >= day);
  if (!birthdayPassed) age -= 1;

  return age;
}

export function birthDateError(iso: string): string | null {
  if (!iso) return null;
  const age = ageFromBirthDate(iso);
  if (age === null || age < 0 || age > 100) return "Date de naissance invalide.";
  if (age < MIN_AGE) {
    return `Tu dois avoir au moins ${MIN_AGE} ans pour candidater. Aucune information n'est enregistrée.`;
  }
  return null;
}

// Accepte "77 123 45 67", "77.123.45.67", "+221 77 123 45 67"...
// et ramène tout à 9 chiffres.
export function normalizePhone(raw: string): string {
  let digits = raw.replace(/[\s.\-()]/g, "");
  if (digits.startsWith("+221")) digits = digits.slice(4);
  else if (digits.startsWith("00221")) digits = digits.slice(5);
  else if (digits.startsWith("221") && digits.length === 12) digits = digits.slice(3);
  return digits;
}

export function phoneError(raw: string): string | null {
  if (!raw.trim()) return null;
  return /^\d{9}$/.test(normalizePhone(raw))
    ? null
    : "Le numéro doit contenir 9 chiffres (ex : 77 123 45 67).";
}

export function emailError(raw: string): string | null {
  if (!raw.trim()) return null; // l'email est facultatif
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(raw.trim())
    ? null
    : "Adresse email invalide.";
}

// Refuse les négatifs, les décimales et les notations comme "1e3"
export function countError(value: string): string | null {
  const v = value.trim();
  if (v === "") return null; // vide = non renseigné
  if (!/^\d+$/.test(v)) return "Entre un nombre entier, 0 ou plus.";
  if (Number(v) > 999) return "Valeur trop grande.";
  return null;
}

type Record6 = {
  nombreCombats: string;
  victoires: string;
  defaites: string;
  nuls: string;
  kos: string;
  soumissions: string;
};

// Cohérence entre les chiffres
export function recordError(f: Record6): string | null {
  const n = (v: string) => (v.trim() === "" ? 0 : Number(v));
  if (n(f.victoires) + n(f.defaites) + n(f.nuls) > n(f.nombreCombats)) {
    return "Victoires + défaites + nuls ne peuvent pas dépasser le nombre de combats.";
  }
  if (n(f.kos) + n(f.soumissions) > n(f.victoires)) {
    return "KO + soumissions ne peuvent pas dépasser le nombre de victoires.";
  }
  return null;
}
