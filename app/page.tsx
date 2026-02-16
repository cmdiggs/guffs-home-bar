import Image from "next/image";
import { GuffsTitle } from "@/components/GuffsTitle";
import { StorySection } from "@/components/StorySection";
import { WhatsNewSection } from "@/components/WhatsNewSection";
import { CocktailBookList } from "@/components/CocktailBookList";
import { HomiesSection } from "@/components/HomiesSection";
import { MemorabiliaSection } from "@/components/MemorabiliaSection";
import { PlaylistSection } from "@/components/PlaylistSection";
import { UploadForm } from "@/components/UploadForm";
import { Footer } from "@/components/Footer";
// Revalidate every 60 seconds to show newly added content
export const revalidate = 60;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section
        className="sticky top-0 z-0 h-screen flex items-center justify-center relative overflow-hidden"
        style={{
          background: "radial-gradient(ellipse 80% 70% at 50% 50%, #35384a, #292b3c 50%, #1e2030)",
        }}
      >
        <div className="container relative z-10 mx-auto px-4 flex justify-center -mt-24 sm:-mt-12 md:mt-0">
          <Image
            src="/guffs-logo.svg"
            alt="Guffs"
            width={420}
            height={560}
            priority
            className="logo-load-animate h-auto w-auto max-h-[540px] max-w-[min(100%,48rem)] object-contain"
          />
        </div>
      </section>

      {/* Story: full-width — “Guffs” title and story span entire section */}
      <section className="relative z-10 min-h-screen bg-card rounded-t-3xl -mt-24 overflow-visible">
        <div className="w-full px-6 sm:px-8 md:px-12 lg:px-20 py-16 md:py-24 overflow-visible">
          <GuffsTitle />
          <StorySection />
        </div>
      </section>

      {/* Rest of content - single block, no cards */}
      <div className="relative z-10 bg-card">
        <WhatsNewSection />
        <section id="cocktails" className="pt-0">
          <div className="w-full bg-[#1d2130]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/cocktails-header.png"
              alt=""
              className="w-full h-auto block"
            />
          </div>
          <div className="container mx-auto px-4 py-12">
            <div className="flex items-center gap-3 mb-8">
              <svg className="h-6 w-6 text-accent shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
                <rect x="4" y="2" width="16" height="4" />
                <rect x="6" y="6" width="12" height="4" />
                <rect x="8" y="10" width="8" height="4" />
                <rect x="10" y="14" width="4" height="6" />
                <rect x="8" y="20" width="8" height="2" />
              </svg>
              <h2 className="font-sans text-3xl font-bold text-foreground">
                Guffs&apos; Cocktails
              </h2>
            </div>
            <CocktailBookList limit={10} />
          </div>
        </section>
        <HomiesSection />
        <MemorabiliaSection />
        <PlaylistSection />
        <section id="share-your-visit" className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <UploadForm />
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
