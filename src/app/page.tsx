import Hero from "@/components/home/hero";
import IntroSection from "@/components/home/IntroSection";
import ValuesSection from "@/components/home/ValuesSection";
import FightersPreview from "@/components/home/FightersPreview";
import CTASection from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <IntroSection />
      <ValuesSection />
      <FightersPreview />
      <CTASection />
    </main>
  );
}