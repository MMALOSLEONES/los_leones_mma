import Button from "@/components/ui/Button";
import { getTranslations } from "next-intl/server";

export default async function CTASection() {
  const t = await getTranslations("CTASection");

  return (
    <section className="border-t border-white/10 bg-neutral-950">
      <div className="mx-auto max-w-4xl px-4 py-24 text-center lg:px-8">
        <h2 className="text-4xl font-extrabold text-white sm:text-5xl">
          {t("title")}
        </h2>
        <p className="mt-4 text-neutral-400">{t("description")}</p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button href="/candidater">{t("apply")}</Button>
          <Button href="/contact" variant="outline">
            {t("contact")}
          </Button>
        </div>
      </div>
    </section>
  );
}