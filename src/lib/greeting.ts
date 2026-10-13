// Bonjour jusqu'à 17h59, Bonsoir ensuite, à l'heure de Dakar.
// Le fuseau est fixé explicitement pour que le résultat soit le même
// quel que soit le serveur qui exécute le code (Vercel, local...).
export function getGreeting(): "Bonjour" | "Bonsoir" {
  const parts = new Intl.DateTimeFormat("fr-FR", {
    hour: "numeric",
    hourCycle: "h23",
    timeZone: "Africa/Dakar",
  }).formatToParts(new Date());

  const hour = Number(parts.find((p) => p.type === "hour")?.value ?? 12);
  return hour >= 18 ? "Bonsoir" : "Bonjour";
}
