import { NextResponse } from "next/server";
import type { ApplicationFormData } from "@/components/types/application";
import { normalizePhone } from "@/lib/validation";
import { parseWeight } from "@/lib/weight";

const API_URL = process.env.API_URL;

// On exclut les anciens champs "photo" uniques de l'interface typée
type Fields = Omit<ApplicationFormData, "photo" | "photos" | "videos">;

// Libellés du formulaire → valeurs exactes attendues par Laravel
const NIVEAU: Record<string, string> = {
  Débutant: "debutant",
  Intermédiaire: "intermediaire",
  Avancé: "avance",
  Professionnel: "professionnel",
};

// Garde les correspondances inchangées
const SOURCE: Record<string, string> = {
  Instagram: "Instagram",
  TikTok: "TikTok",
  Facebook: "Facebook",
  WhatsApp: "WhatsApp",
  Recommandation: "Recommandation",
  Google: "Google",
  Autre: "Autre",
};

export async function POST(request: Request) {
  let fields: Fields;
  let photosFiles: File[] = [];
  let videosFiles: File[] = [];

  try {
    const form = await request.formData();
    fields = JSON.parse(String(form.get("data")));
    
    // Récupération dynamique des tableaux de fichiers multimédias
    let index = 0;
    while (form.has(`photos[${index}]`)) {
      const file = form.get(`photos[${index}]`);
      if (file instanceof File) photosFiles.push(file);
      index++;
    }

    index = 0;
    while (form.has(`videos[${index}]`)) {
      const file = form.get(`videos[${index}]`);
      if (file instanceof File) videosFiles.push(file);
      index++;
    }
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  // Vérification de sécurité locale
  if (!fields.consentAccepted) {
    return NextResponse.json(
      { message: "Le consentement est requis." },
      { status: 400 },
    );
  }

  // Sécurité : Une candidature doit posséder au moins une photo
  if (photosFiles.length === 0) {
    return NextResponse.json(
      { message: "La photo est obligatoire." },
      { status: 400 },
    );
  }

  // Préparation de l'envoi propre pour Laravel
  const out = new FormData();
  const set = (key: string, value: string | boolean | null | undefined) => {
    if (value === null || value === undefined || value === "") return;
    out.append(key, typeof value === "boolean" ? (value ? "1" : "0") : value);
  };

  set("nom", fields.nom.trim());
  set("prenom", fields.prenom.trim());
  set("tel", normalizePhone(fields.telephone));
  set("mail", fields.email.trim());
  set("date_naissance", fields.dateNaissance);
  set("ville", fields.ville.trim());
  set("quartier", fields.quartier.trim());

  const kg = parseWeight(fields.poidsKg);
  if (kg !== null) set("poids_kg", String(kg));

  set("a_experience_combat", fields.aExperienceCombat === true);
  if (fields.aExperienceCombat) {
    set("experience_niveau", NIVEAU[fields.niveau]);
    if (fields.aFaitCompetitions !== null) {
      set("a_fait_competitions", fields.aFaitCompetitions);
    }
    if (fields.aFaitCompetitions) {
      set("nombre_combats", fields.nombreCombats);
      set("victoires", fields.victoires);
      set("defaites", fields.defaites);
      set("nuls", fields.nuls);
      set("kos", fields.kos);
      set("soumissions", fields.soumissions);
    }
  }

  set("comment_connu", SOURCE[fields.commentConnu]);
  set("consent_accepted", true);

  // Injection ordonnée du lot complet de photos dans le nouveau FormData
  photosFiles.forEach((file, idx) => {
    out.append(`photos[${idx}]`, file, file.name);
  });

  // Injection ordonnée du lot complet de vidéos dans le nouveau FormData
  videosFiles.forEach((file, idx) => {
    out.append(`videos[${idx}]`, file, file.name);
  });

  let laravelResponse: Response;
  try {
    laravelResponse = await fetch(`${API_URL}/candidatures`, {
      method: "POST",
      headers: { Accept: "application/json" },
      body: out,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Serveur injoignable. Réessaie dans quelques instants." },
      { status: 502 },
    );
  }

  const result = await laravelResponse.json().catch(() => ({}));

  if (!laravelResponse.ok) {
    const firstError = result.errors
      ? (Object.values(result.errors).flat()[0] as string | undefined)
      : undefined;
    return NextResponse.json(
      {
        message:
          firstError ??
          result.message ??
          "Impossible d'enregistrer la candidature.",
      },
      { status: laravelResponse.status },
    );
  }

  return NextResponse.json({
    status: "ok",
    referenceCode: result.data?.reference_code ?? null,
  });
}
