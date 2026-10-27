import Button from "@/components/ui/Button";
import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative flex min-h-[90vh] items-end overflow-hidden bg-neutral-950">
      {/* Image de fond */}
      <Image
        src="/images/hero/hero.jpg"
        alt=""
        fill
        priority
        className="object-cover object-center"
      />
      <div className="absolute inset-0 bg-black/60" />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 lg:px-8">
        <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-orange-500">
          MIXED MARTIAL ARTS MANAGEMENT — SENEGAL
        </p>
        <h1 className="text-5xl font-extrabold leading-[0.95] text-white sm:text-6xl lg:text-8xl">
          DEVIENS
          <br />
          UN LION.
        </h1>
        <p className="mt-6 max-w-md text-neutral-300">
          Los Leones repère, développe et accompagne des combattants MMA vers le
          plus haut niveau.
        </p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/candidater">DEVENIR UN LEONE</Button>
          <Button href="/fighters" variant="outline">
            DÉCOUVRIR LES FIGHTERS
          </Button>
        </div>
      </div>
    </section>
  );
}
