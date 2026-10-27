import ClubHero from "@/components/club/ClubHero";
import ClubSection from "@/components/club/ClubSection";
import GallerySection from "@/components/club/GallerySection";
import ValuesSection from "@/components/home/ValuesSection";
import CTASection from "@/components/home/CTASection";
import { getTranslations } from "next-intl/server";

export default async function ClubPage() {
  const t = await getTranslations("ClubPage");

  return (
    <main>
      <ClubHero />

      <ClubSection
        eyebrow={t("history.eyebrow")}
        title={t("history.title")}
        paragraphs={[t("history.p1"), t("history.p2")]}
      />

      <ClubSection
        eyebrow={t("vision.eyebrow")}
        title={t("vision.title")}
        reverse
        paragraphs={[t("vision.p1"), t("vision.p2")]}
      />

      <ValuesSection />
      <GallerySection />
      <CTASection />
    </main>
  );
}