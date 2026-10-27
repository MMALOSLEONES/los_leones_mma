import Button from "@/components/ui/Button";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import { getTranslations } from "next-intl/server";

export default async function PartnerCTA() {
  const t = await getTranslations("PartnerCTA");

  return (
    <section className="mx-auto max-w-4xl px-4 py-20 lg:px-8">
      <div className="rounded-md border border-white/10 px-6 py-16 text-center">
        <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
          {t("title")}
        </h2>
        <p className="mx-auto mt-4 max-w-md text-neutral-400">
          {t("description")}
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button href="/contact">{t("contact")}</Button>
          <WhatsAppButton
            variant="outline"
            message={t("whatsappMessage")}
          />
        </div>
      </div>
    </section>
  );
}