import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TOKEN_COOKIE } from "@/lib/session";
import type { ApiList } from "@/components/types/api";

const API_URL = process.env.API_URL;

// À utiliser UNIQUEMENT dans des Server Components : lit le cookie httpOnly
// et appelle Laravel avec le token.
export async function apiGet<T>(path: string): Promise<T> {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  if (!token) redirect("/login");

  const response = await fetch(`${API_URL}${path}`, {
    headers: { Authorization: `Bearer ${token}`, Accept: "application/json" },
    cache: "no-store",
  });

  // Token expiré ou révoqué : Laravel refuse, on renvoie vers la connexion
  if (response.status === 401) redirect("/login");
  if (!response.ok) {
    throw new Error(`Erreur API ${response.status} sur ${path}`);
  }

  return response.json();
}

// Laravel renvoie soit un tableau, soit { data: [...] } (pagination, Resources)
export function unwrap<T>(payload: ApiList<T>): T[] {
  return Array.isArray(payload) ? payload : (payload.data ?? []);
}
