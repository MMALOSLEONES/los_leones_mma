import { notFound } from "next/navigation";
import { getFighter, getFighters } from "@/lib/public-api";
import FighterHero from "@/components/fighters/FighterHero";
import FighterStats from "@/components/fighters/FighterStats";
import FighterBio from "@/components/fighters/FighterBio";
import FighterAchievements from "@/components/fighters/FighterAchievements";
import OtherFighters from "@/components/fighters/OtherFighters";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export default async function FighterProfilePage({ params }: PageProps) {
  const { slug } = await params;

  const [fighter, allFighters] = await Promise.all([
    getFighter(slug),
    getFighters(),
  ]);

  if (!fighter) {
    notFound();
  }

  const otherFighters = allFighters
    .filter((f) => f.id !== fighter.id)
    .slice(0, 3);

  return (
    <main>
      <FighterHero fighter={fighter} />
      <FighterStats fighter={fighter} />

      <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
          <FighterBio fighter={fighter} />
          <FighterAchievements fighter={fighter} />
        </div>
      </section>

      <OtherFighters fighters={otherFighters} />
    </main>
  );
}
