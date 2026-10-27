import { NextResponse } from "next/server";
import type { ApplicationFormData } from "@/components/types/application";
import { normalizePhone } from "@/lib/validation";

const API_URL = process.env.API_URL;

type Fields = Omit<ApplicationFormData, "photo">;

// Libellés du formulaire → valeurs exactes attendues par Laravel
const NIVEAU: Record<string, string> = {
  Débutant: "debutant",
  Intermédiaire: "intermediaire",
  Avancé: "avance",
  Professionnel: "professionnel",
};

const SOURCE: Record<string, string> = {
  Instagram: "instagram",
  TikTok: "tiktok",
  Facebook: "facebook",
  WhatsApp: "whatsapp",
  Recommandation: "recommandation",
  Google: "google",
  Autre: "autre",
};

export async function POST(request: Request) {
  let fields: Fields;
  let photo: File | null;

  try {
    const form = await request.formData();
    fields = JSON.parse(String(form.get("data")));
    const file = form.get("photo");
    photo = file instanceof File ? file : null;
  } catch {
    return NextResponse.json({ message: "Requête invalide." }, { status: 400 });
  }

  if (!fields.consentAccepted) {
    return NextResponse.json({ message: "Le consentement est requis." }, { status: 400 });
  }
  if (!photo) {
    return NextResponse.json({ message: "La photo est obligatoire." }, { status: 400 });
  }

  // On ne transmet à Laravel que les champs qu'il connaît. Le statut n'est jamais
  // envoyé : Laravel décide lui-même de la valeur de départ.
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
  out.append("photo", photo, photo.name);

  let laravelResponse: Response;
  try {
    laravelResponse = await fetch(`${API_URL}/candidatures`, {
      method: "POST",
      // Pas de Content-Type ici non plus : il est ajouté avec le séparateur du multipart
      headers: { Accept: "application/json" },
      body: out,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Serveur injoignable. Réessaie dans quelques instants." },
      { status: 502 }
    );
  }

  const result = await laravelResponse.json().catch(() => ({}));

  if (!laravelResponse.ok) {
    // On affiche la première erreur précise plutôt que "(and 1 more error)"
    const firstError = result.errors
      ? (Object.values(result.errors).flat()[0] as string | undefined)
      : undefined;
    return NextResponse.json(
      {
        message: firstError ?? result.message ?? "Impossible d'enregistrer la candidature.",
      },
      { status: laravelResponse.status }
    );
  }

  return NextResponse.json({
    status: "ok",
    referenceCode: result.data?.reference_code ?? null,
  });
}
