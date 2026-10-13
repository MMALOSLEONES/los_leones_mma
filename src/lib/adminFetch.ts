// À utiliser dans les composants client. Le navigateur ne peut pas lire le
// cookie httpOnly : il appelle /api/admin/..., et c'est le serveur Next.js
// qui ajoute le token avant de relayer vers Laravel.
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
    throw new Error(data.message || `Erreur (${response.status}).`);
  }
  return data as T;
}
