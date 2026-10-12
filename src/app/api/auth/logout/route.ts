import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/session";

const API_URL = process.env.API_URL;

export async function POST() {
  const cookieStore = await cookies();
  const token = cookieStore.get(TOKEN_COOKIE)?.value;

  // On révoque le token côté Laravel (sinon il resterait valide jusqu'à
  // son expiration même après la déconnexion). Si Laravel est injoignable,
  // on supprime quand même le cookie.
  if (token) {
    await fetch(`${API_URL}/admin/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    }).catch(() => {});
  }

  const response = NextResponse.json({ status: "ok" });
  response.cookies.delete(TOKEN_COOKIE);
  return response;
}