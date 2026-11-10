// Envoi d'un gros fichier directement du navigateur vers Cloudflare R2,
// avec la progression. Utilisé pour les vidéos.
export function putFile(
  url: string,
  file: File,
  signedHeaders: Record<string, string[] | string>,
  onProgress: (percent: number) => void
): Promise<void> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("PUT", url);

    // En-têtes qui ont servi à signer l'adresse. Le navigateur ajoute lui-même
    // "Host" et "Content-Length", qu'il est interdit de fixer à la main.
    for (const [name, value] of Object.entries(signedHeaders)) {
      const lower = name.toLowerCase();
      if (lower === "host" || lower === "content-length") continue;
      xhr.setRequestHeader(name, Array.isArray(value) ? value.join(",") : value);
    }
    const hasContentType = Object.keys(signedHeaders).some(
      (name) => name.toLowerCase() === "content-type"
    );
    if (!hasContentType) xhr.setRequestHeader("Content-Type", file.type);

    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve();
      } else {
        reject(new Error(`Envoi refusé par le stockage (code ${xhr.status}).`));
      }
    };
    xhr.onerror = () =>
      reject(
        new Error(
          "Envoi interrompu. Vérifie ta connexion et la règle CORS du bucket R2."
        )
      );
    xhr.onabort = () => reject(new Error("Envoi annulé."));

    xhr.send(file);
  });
}
