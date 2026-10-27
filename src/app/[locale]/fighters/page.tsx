import { getFighters } from "@/lib/public-api";
import FightersExplorer from "@/components/fighters/FightersExplorer";

export default async function FightersPage() {
  const fighters = await getFighters();
  return <FightersExplorer fighters={fighters} />;
}
