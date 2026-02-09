import Image from "next/image";
import { StorySection } from "@/components/StorySection";
import { CocktailsSection } from "@/components/CocktailsSection";
import { HomiesSection } from "@/components/HomiesSection";
import { MemorabiliaSection } from "@/components/MemorabiliaSection";
import { UploadForm } from "@/components/UploadForm";
import { Footer } from "@/components/Footer";
import { getMemorabilia } from "@/lib/db";

export default function HomePage() {
  const memorabilia = getMemorabilia();
  return (
    <div className="min-h-screen bg-background">
      {/* Hero - Story card slides up over it on scroll */}
      <section className="sticky top-0 z-0 h-screen flex items-center justify-center bg-background">
        <div className="container mx-auto px-4 flex justify-center">
          <Image
            src="/guffs-logo.svg"
            alt="Guffs"
            width={600}
            height={200}
            priority
            className="w-full max-w-2xl h-auto"
          />
        </div>
      </section>

      {/* Only card: Story - slides up over hero */}
      <section className="relative z-10 min-h-screen bg-card rounded-t-3xl -mt-24 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]">
        <div className="container mx-auto px-6 md:px-12 py-16 md:py-24">
          <div className="max-w-full md:max-w-[50%] mx-auto">
            <h2 className="font-sans text-4xl md:text-5xl text-card-foreground mb-12 text-center py-[75px]">
              <span className="block font-bold">Welcome to Guffs</span>
              <span className="block font-semibold">A familiar place,</span>
              <span className="block font-semibold">Every time</span>
            </h2>
            <StorySection />
          </div>
        </div>
      </section>

      {/* Rest of content - single block, no cards */}
      <div className="relative z-10 bg-card">
        <CocktailsSection />
        <HomiesSection />
        <MemorabiliaSection items={memorabilia} />
        <section className="container mx-auto px-4 py-12">
          <div className="max-w-2xl mx-auto">
            <UploadForm />
          </div>
        </section>
        <Footer />
      </div>
    </div>
  );
}
