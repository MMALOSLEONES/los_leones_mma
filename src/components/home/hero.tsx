import Button from "@/components/ui/Button";
import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative flex min-h-[90vh] items-end overflow-hidden bg-neutral-950">
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
          {t("eyebrow")}
        </p>
        <h1 className="text-5xl font-extrabold leading-[0.95] text-white sm:text-6xl lg:text-8xl">
          {t("titleLine1")}
          <br />
          {t("titleLine2")}
        </h1>
        <p className="mt-6 max-w-md text-neutral-300">{t("description")}</p>

        <div className="mt-8 flex flex-col gap-4 sm:flex-row">
          <Button href="/candidater">{t("ctaApply")}</Button>
          <Button href="/fighters" variant="outline">
            {t("ctaFighters")}
          </Button>
        </div>
      </div>
    </section>
  );
}