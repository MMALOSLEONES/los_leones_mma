import { Fighter } from "@/components/types/fighter";
import Button from "@/components/ui/Button";

export default function FighterAchievements({ fighter }: { fighter: Fighter }) {
  return (
    <div>
      <h2 className="text-xs font-bold tracking-widest text-orange-500">
        PALMARÈS
      </h2>
      <ul className="mt-3 space-y-2">
        {fighter.achievements.map((achievement) => (
          <li
            key={achievement}
            className="rounded-md bg-neutral-900 px-4 py-3 text-sm text-neutral-300"
          >
            {achievement}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <Button href="/candidater">REJOINDRE L&apos;AGENCE</Button>
        <Button href="/contact" variant="outline">
          CONTACTER L&apos;AGENT
        </Button>
      </div>
    </div>
  );
}
