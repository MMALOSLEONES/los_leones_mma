import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function PartnerHero() {
  const t = await getTranslations("PartnerHero");

  return (
    <section className="border-b border-white/10 bg-neutral-950 px-4 py-20 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold tracking-[0.3em] text-orange-500">
          {t("eyebrow")}
        </p>
        <h1 className="mt-4 text-4xl font-extrabold text-white sm:text-6xl">
          {t("title")}
        </h1>
        <p className="mt-4 text-neutral-400">{t("description")}</p>
        <Button href="/contact" className="mt-8 w-fit">
          {t("cta")}
        </Button>
      </div>
    </section>
  );
}