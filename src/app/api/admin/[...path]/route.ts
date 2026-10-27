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
  const isMultipart = (request.headers.get("content-type") ?? "").startsWith("multipart/form-data");

  const headers: Record<string, string> = {
    Authorization: `Bearer ${token}`,
    Accept: "application/json",
  };

  let body: BodyInit | undefined;
  if (hasBody) {
    if (isMultipart) {
      // Fichiers : on relit le formulaire et on le renvoie. Pas de Content-Type ici,
      // il est recalculé avec le bon séparateur.
      body = await request.formData();
    } else {
      body = await request.text();
      headers["Content-Type"] = "application/json";
    }
  }

  let laravelResponse: Response;
  try {
    laravelResponse = await fetch(url, {
      method: request.method,
      headers,
      body,
      cache: "no-store",
    });
  } catch {
    return NextResponse.json(
      { message: "Serveur injoignable." },
      { status: 502 }
    );
  }

  const contentType = laravelResponse.headers.get("Content-Type") ?? "application/json";
  const isTextual = /json|text/.test(contentType);

  // Texte/JSON : lu comme du texte. Image ou autre fichier (photo d'un candidat) :
  // lu en binaire, sinon l'image serait corrompue en route. Un 204 n'a pas de corps.
  let payload: string | ArrayBuffer | null;
  if (laravelResponse.status === 204) {
    payload = null;
  } else if (isTextual) {
    payload = await laravelResponse.text();
  } else {
    payload = await laravelResponse.arrayBuffer();
  }

  const responseHeaders: Record<string, string> = { "Content-Type": contentType };
  const cacheControl = laravelResponse.headers.get("Cache-Control");
  if (cacheControl && !isTextual) {
    responseHeaders["Cache-Control"] = cacheControl;
  }

  return new NextResponse(payload, {
    status: laravelResponse.status,
    headers: responseHeaders,
  });
}

export {
  forward as GET,
  forward as POST,
  forward as PUT,
  forward as PATCH,
  forward as DELETE,
};
