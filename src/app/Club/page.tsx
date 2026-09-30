import ClubHero from "@/components/club/ClubHero";
import ClubSection from "@/components/club/ClubSection";
import GallerySection from "@/components/club/GallerySection";
import ValuesSection from "@/components/home/ValuesSection";
import CTASection from "@/components/home/CTASection";

export default function ClubPage() {
  return (
    <main>
      <ClubHero />

      <ClubSection
        eyebrow="NOTRE HISTOIRE"
        title="Né d'une conviction"
        paragraphs={[
          "Los Leones est née d'un constat simple : le Sénégal regorge de combattants talentueux, mais trop peu d'entre eux ont accès à un vrai accompagnement de carrière.",
          "L'agence a été fondée pour combler ce manque — repérer les talents, les préparer sérieusement, et leur ouvrir des portes qu'ils n'auraient pas pu franchir seuls.",
        ]}
      />

      <ClubSection
        eyebrow="NOTRE VISION"
        title="Porter le MMA sénégalais plus haut"
        reverse
        paragraphs={[
          "Devenir la référence du management de fighters MMA en Afrique de l'Ouest, reconnue pour l'exigence de son accompagnement et l'intégrité de sa méthode.",
          "Chaque Leone représenté doit pouvoir se concentrer sur une seule chose : combattre au plus haut niveau, pendant que l'agence gère le reste.",
        ]}
      />

      <ValuesSection />

      <GallerySection />

      <CTASection />
    </main>
  );
}