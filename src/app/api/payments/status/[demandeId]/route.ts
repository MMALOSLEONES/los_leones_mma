
import { NextResponse } from "next/server";

const API_URL = process.env.API_URL;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ demandeId: string }> },
) {
  try {
    if (!API_URL) {
      return NextResponse.json(
        { message: "URL du backend non configurée." },
        { status: 500 },
      );
    }

    const { demandeId } = await params;

    if (!demandeId) {
      return NextResponse.json(
        { message: "Identifiant de candidature manquant." },
        { status: 400 },
      );
    }

    const laravelResponse = await fetch(
      `${API_URL.replace(/\/$/, "")}/payments/status/${encodeURIComponent(demandeId)}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      },
    );

    const result = await laravelResponse.json().catch(() => ({}));

    return NextResponse.json(result, {
      status: laravelResponse.status,
    });
  } catch (error) {
    console.error("Erreur vérification paiement :", error);

    return NextResponse.json(
      { message: "Impossible de vérifier le statut du paiement." },
      { status: 502 },
    );
  }
}
