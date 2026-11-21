import PartnerHero from "@/components/partenaires/PartnerHero";
import PartnerIntro from "@/components/partenaires/PartnerIntro";
import PartnershipTypes from "@/components/partenaires/PartnershipTypes";
import PartnerCTA from "@/components/partenaires/PartnerCTA";
import PartnersSection from "@/components/partenaires/PartnersSection";

export default function PartenairesPage() {
  return (
    <main>
      <PartnerHero />
      <PartnerIntro />
      <PartnershipTypes />
      <PartnersSection />
      <PartnerCTA />
      
    </main>
  );
}
