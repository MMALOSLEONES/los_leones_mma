import { adminRequest } from "@/lib/adminFetch";
import { putFile } from "@/lib/directUpload";

// Ces limites sont aussi vérifiées par Laravel : ici elles évitent
// d'envoyer un fichier qui sera refusé.
export const VIDEO_TYPES = ["video/mp4", "video/webm"];
export const MAX_VIDEO_BYTES = 150 * 1024 * 1024; // 150 Mo
export const MAX_PHOTOS = 10;
export const MAX_VIDEOS = 5;

type UploadTarget =
  | {
      mode: "direct";
      url: string;
      headers: Record<string, string[] | string>;
      chemin: string;
    }
  | { mode: "server"; chemin: null };

export function videoFileError(file: File): string | null {
  if (!VIDEO_TYPES.includes(file.type)) {
    return "Format non accepté : utilise une vidéo MP4 ou WebM.";
  }
  if (file.size > MAX_VIDEO_BYTES) {
    const mo = Math.round(file.size / 1024 / 1024);
    return `Vidéo trop lourde (${mo} Mo). Maximum : 150 Mo.`;
  }
  return null;
}

export async function uploadFighterVideo(
  fighterId: string,
  file: File,
  onProgress: (percent: number) => void
): Promise<void> {
  const problem = videoFileError(file);
  if (problem) throw new Error(problem);

  // 1) Laravel signe une adresse d'envoi temporaire
  const target = await adminRequest<UploadTarget>(
    `/fighters/${fighterId}/videos/upload-url`,
    "POST",
    { content_type: file.type, size: file.size }
  );

  if (target.mode === "direct") {
    // 2) le navigateur envoie le fichier directement à R2
    await putFile(target.url, file, target.headers, onProgress);
    // 3) on déclare la vidéo à Laravel, qui vérifie que le fichier existe
    await adminRequest(`/fighters/${fighterId}/videos`, "POST", {
      chemin: target.chemin,
    });
    return;
  }

  // Développement local : le disque local ne sait pas signer d'adresse,
  // le fichier passe alors par Laravel.
  onProgress(0);
  const body = new FormData();
  body.append("video", file);
  const response = await fetch(`/api/admin/fighters/${fighterId}/videos/file`, {
    method: "POST",
    body,
  });
  if (response.status === 401) {
    window.location.href = "/login";
    throw new Error("Session expirée.");
  }
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(
      data.errors?.video?.[0] ?? data.message ?? `Erreur (${response.status}).`
    );
  }
  onProgress(100);
}
