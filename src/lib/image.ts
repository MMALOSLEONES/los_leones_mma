// Prépare la photo AVANT l'envoi : on la réduit et on la convertit en JPEG.
// Pourquoi : une photo de téléphone fait souvent 5 à 10 Mo, alors que l'envoi
// passe par le serveur Next.js (limité à environ 4,5 Mo sur Vercel).
// Bonus vie privée : le ré-encodage supprime les métadonnées (position GPS...).

const MAX_SIDE = 1600; // pixels, côté le plus long
const QUALITY = 0.85;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function prepareImage(file: File): Promise<File> {
  if (!ACCEPTED_TYPES.includes(file.type)) {
    throw new Error("Format non accepté. Utilise une photo JPG, PNG ou WebP.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file);
  } catch {
    throw new Error("Cette image ne peut pas être lue. Essaie une autre photo.");
  }

  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);

  const context = canvas.getContext("2d");
  if (!context) throw new Error("Traitement de l'image impossible.");

  // Fond blanc : un PNG transparent deviendrait noir en JPEG
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, "image/jpeg", QUALITY)
  );
  if (!blob) throw new Error("Traitement de l'image impossible.");
  if (blob.size > MAX_UPLOAD_BYTES) {
    throw new Error("La photo est trop lourde. Essaie une autre photo.");
  }

  const baseName = file.name.replace(/\.[^.]+$/, "") || "photo";
  return new File([blob], `${baseName}.jpg`, { type: "image/jpeg" });
}
