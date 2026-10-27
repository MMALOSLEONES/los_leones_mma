import Hero from "@/components/home/hero";
import IntroSection from "@/components/home/IntroSection";
import ValuesSection from "@/components/home/ValuesSection";
import FightersPreview from "@/components/home/FightersPreview";
import CTASection from "@/components/home/CTASection";
import PartnersSection from "@/components/home/PartnersSection";
import NewsSection from "@/components/home/NewsSection";
import AnnouncementBar from "@/components/home/AnnouncementBar";

export default function HomePage() {
  return (
    <main>
      <Hero />
  <AnnouncementBar />
     
       <NewsSection  />

      <IntroSection />
    
      <ValuesSection />
      <div className="h-16 bg-neutral-950">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="h-px bg-white/10" />
        </div>
      </div>
      <FightersPreview />
      <PartnersSection />
      <CTASection />
    </main>
  );
}
