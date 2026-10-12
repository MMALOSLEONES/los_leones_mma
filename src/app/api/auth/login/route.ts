import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/session";

const API_URL = process.env.API_URL;

export async function POST(request: Request) {
  const { email, password } = await request.json();

  let laravelResponse: Response;
  try {
    laravelResponse = await fetch(`${API_URL}/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Indispensable avec Laravel : sans ce header, une erreur de
        // validation renvoie une redirection HTML au lieu d'un JSON 422.
        Accept: "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return NextResponse.json(
      { status: "error", message: "Serveur injoignable." },
      { status: 502 }
    );
  }

  const result = await laravelResponse.json().catch(() => ({}));

  if (!laravelResponse.ok) {
    return NextResponse.json(
      { status: "error", message: result.message || "Connexion impossible." },
      { status: laravelResponse.status }
    );
  }

  const response = NextResponse.json({ status: "ok" });
  response.cookies.set(TOKEN_COOKIE, result.token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
  });

  return response;
}