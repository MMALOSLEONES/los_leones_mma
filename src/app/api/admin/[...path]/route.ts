import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/session";

const API_URL = process.env.API_URL;

// Relais unique : /api/admin/xxx  →  Laravel /api/admin/xxx
// Il ajoute le token du cookie httpOnly. Laravel (auth:sanctum) reste
// la vraie barrière : un token invalide y reçoit un 401.
async function forward(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path } = await params;

  // Le préfixe /admin est fixé ici : ce relais ne peut atteindre que les routes admin
  if (path.some((segment) => segment === ".." || segment === ".")) {
    return NextResponse.json({ message: "Chemin invalide." }, { status: 400 });
  }

  const token = request.cookies.get(TOKEN_COOKIE)?.value;
  if (!token) {
    return NextResponse.json({ message: "Non authentifié." }, { status: 401 });
  }

  const url = `${API_URL}/admin/${path.map(encodeURIComponent).join("/")}${request.nextUrl.search}`;
  const hasBody = !["GET", "HEAD"].includes(request.method);

  let laravelResponse: Response;
  try {
    laravelResponse = await fetch(url, {
      method: request.method,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        ...(hasBody ? { "Content-Type": "application/json" } : {}),
      },
      body: hasBody ? await request.text() : undefined,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Serveur injoignable." },
      { status: 502 }
    );
  }

  // Un 204 ne doit pas avoir de corps
  const text = laravelResponse.status === 204 ? null : await laravelResponse.text();

  return new NextResponse(text, {
    status: laravelResponse.status,
    headers: {
      "Content-Type":
        laravelResponse.headers.get("Content-Type") ?? "application/json",
    },
  });
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
};
