import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/session";

const API_URL = process.env.API_URL || "http://localhost:8000/api";

export async function POST(request: NextRequest) {
  try {
    const credentials = await request.json();

    // 1. Envoyer la demande d'authentification au back-end Laravel
    console.log("Appel Laravel :", `${API_URL}/login`);
    const laravelResponse = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(credentials),
      cache: "no-store",
    });

    const result = await laravelResponse.json();

    if (!laravelResponse.ok) {
      return NextResponse.json(
        { message: result.message || "Identifiants incorrects." },
        { status: laravelResponse.status }
      );
    }

    // 2. Extraire le token renvoyé par Laravel (ex: token Sanctum)
    const token = result.token;

    const response = NextResponse.json({
      message: "Connexion réussie !",
      user: result.user,
    }, { status: 200 });

    // 3. Sécuriser le token dans un cookie httpOnly côté client
    if (token) {
      response.cookies.set(TOKEN_COOKIE, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 1 semaine
      });
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { message: "Serveur d'authentification injoignable." },
      { status: 502 }
    );
  }
}
