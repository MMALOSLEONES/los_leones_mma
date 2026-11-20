import { adminRequest } from "@/lib/adminFetch";
import { putFile } from "@/lib/directUpload";

export const VIDEO_TYPES = ["video/mp4", "video/webm", "video/quicktime"];
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

// Certains navigateurs ne renseignent pas le type d'un fichier .mov : on le déduit du nom
export function videoContentType(file: File): string {
  if (file.type) return file.type;
  const name = file.name.toLowerCase();
  if (name.endsWith(".mov")) return "video/quicktime";
  if (name.endsWith(".mp4") || name.endsWith(".m4v")) return "video/mp4";
  if (name.endsWith(".webm")) return "video/webm";
  return "";
}

export function videoFileError(file: File): string | null {
  if (!VIDEO_TYPES.includes(videoContentType(file))) {
    return "Format non accepté : utilise une vidéo MP4, MOV ou WebM.";
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

  const contentType = videoContentType(file);

  // 1) Laravel signe une adresse d'envoi temporaire
  const target = await adminRequest<UploadTarget>(
    `/fighters/${fighterId}/videos/upload-url`,
    "POST",
    { content_type: contentType, size: file.size }
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

  // Développement local : le fichier passe par Laravel
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
      data.errors?.video?.[0] || data.message || `Erreur (${response.status}).`
    );
  }
  onProgress(100);
}