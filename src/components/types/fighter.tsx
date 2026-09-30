export type WeightCategory =
  | "Flyweight"
  | "Bantamweight"
  | "Featherweight"
  | "Lightweight"
  | "Welterweight"
  | "Middleweight"
  | "Light Heavyweight"
  | "Heavyweight";

// Niveau affiché PUBLIQUEMENT sur la page fighters — différent du niveau
// déclaré dans le formulaire de candidature (voir applications.experience_niveau)
export type FighterTier = "Professionnel" | "Semi-Pro" | "Amateur";

export interface Fighter {
  id: string;
  slug: string;
  fullName: string;
  nickname?: string;
  discipline: string; // "MMA" pour tous pour l'instant, champ gardé pour évolutivité
  weightCategory: WeightCategory;
  weightKg: number;
  tier: FighterTier;
  record: {
    wins: number;
    losses: number;
    draws: number;
    kos: number;
    submissions: number;
  };
  bio: string;
  fightingStyle: string;
  achievements: string[];
  photoUrl?: string;
  instagram?: string;
}