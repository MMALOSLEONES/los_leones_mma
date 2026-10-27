import Image from "next/image";
import Button from "@/components/ui/Button";
import { useTranslations } from "next-intl";

export default function IntroSection() {
  const t = useTranslations("IntroSection");

  return (
    <section className="mx-auto max-w-7xl px-4 py-24 lg:px-8">
      <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
        {/* Image */}
        <div className="relative h-[400px] w-full overflow-hidden rounded-md">
          <Image
            src="/images/club.jpg"
            alt="Los Leones"
            fill
            className="object-cover"
          />
        </div>

        {/* Texte */}
        <div>
          <p className="mb-4 text-xs font-semibold tracking-[0.3em] text-orange-500">
            {t("eyebrow")}
          </p>
          <h2 className="text-3xl font-extrabold leading-[0.95] text-white sm:text-4xl lg:text-5xl">
            {t("titleLine1")}
            <br />
            {t("titleLine2")}
          </h2>

          <p className="mt-6 max-w-xl text-neutral-400">{t("description")}</p>

          <ul className="mt-7 space-y-4">
            <li className="flex items-start gap-3 text-sm text-neutral-300">
              <span className="mt-2 h-px w-5 shrink-0 bg-orange-500" />
              <span>{t("point1")}</span>
            </li>

            <li className="flex items-start gap-3 text-sm text-neutral-300">
              <span className="mt-2 h-px w-5 shrink-0 bg-orange-500" />
              <span>{t("point2")}</span>
            </li>

            <li className="flex items-start gap-3 text-sm text-neutral-300">
              <span className="mt-2 h-px w-5 shrink-0 bg-orange-500" />
              <span>{t("point3")}</span>
            </li>
          </ul>

          <Button href="/club" variant="outline" className="mt-8">
            {t("discover")}
          </Button>
        </div>
      </div>
    </section>
  );
}
