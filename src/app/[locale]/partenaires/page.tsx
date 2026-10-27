import PartnerHero from "@/components/partenaires/PartnerHero";
import PartnerIntro from "@/components/partenaires/PartnerIntro";
import PartnershipTypes from "@/components/partenaires/PartnershipTypes";
import PartnerCTA from "@/components/partenaires/PartnerCTA";

export default function PartenairesPage() {
  return (
    <main>
      <PartnerHero />
      <PartnerIntro />
      <PartnershipTypes />
      <PartnerCTA />
    </main>
  );
}
