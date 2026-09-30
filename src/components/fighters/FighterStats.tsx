import { Fighter } from "@/components/types/fighter";

export default function FighterStats({ fighter }: { fighter: Fighter }) {
  const { wins, losses, draws, kos, submissions } = fighter.record;
  const totalFights = wins + losses + draws;

  const stats = [
    { label: "COMBATS", value: totalFights },
    { label: "VICTOIRES", value: wins },
    { label: "DÉFAITES", value: losses },
    { label: "KO", value: kos },
    { label: "SOUMISSIONS", value: submissions },
  ];

  return (
    <section className="mx-auto mt-12 max-w-7xl border-y border-white/10 px-4 py-8 lg:px-8">
      <div className="grid grid-cols-3 gap-6 sm:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label}>
            <p className="text-xs font-semibold tracking-widest text-neutral-500">
              {stat.label}
            </p>
            <p className="mt-1 text-3xl font-extrabold text-orange-500">
              {stat.value}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
