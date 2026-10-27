// À utiliser dans les composants client. Le navigateur ne peut pas lire le
// cookie httpOnly : il appelle /api/admin/..., et c'est le serveur Next.js
// qui ajoute le token avant de relayer vers Laravel.

// Laravel renvoie "(and 1 more error)" en anglais quand il y a plusieurs erreurs :
// on préfère afficher la première erreur précise.
function errorMessage(data: { message?: string; errors?: Record<string, string[]> }, status: number) {
  const first = data.errors ? Object.values(data.errors).flat()[0] : undefined;
  return first ?? data.message ?? `Erreur (${status}).`;
}

export async function adminRequest<T = unknown>(
  path: string,
  method: "POST" | "PUT" | "DELETE",
  body?: unknown
): Promise<T> {
  const response = await fetch(`/api/admin${path}`, {
    method,
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });

  if (response.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expirée.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(errorMessage(data, response.status));
  }
  return data as T;
}

// Envoi d'UNE photo. On envoie les photos une par une : chaque requête reste
// légère (la limite de Vercel est d'environ 4,5 Mo par requête) et l'ordre est conservé.
export async function adminUpload<T = unknown>(path: string, file: File): Promise<T> {
  const body = new FormData();
  body.append("photo", file);

  // Pas de header Content-Type : le navigateur ajoute le séparateur du multipart
  const response = await fetch(`/api/admin${path}`, { method: "POST", body });

  if (response.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expirée.");
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(errorMessage(data, response.status));
  }
  return data as T;
}
