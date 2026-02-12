import Image from "next/image";
import type { WhatsNew } from "@/lib/db";

type Props = { data: WhatsNew | null };

export function WhatsNewSection({ data }: Props) {
  if (!data) return null;

  return (
    <section className="container mx-auto px-4 py-12" id="whats-new">
      <div className="flex items-center gap-3 mb-6">
        <svg className="h-6 w-6 text-accent shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
        <h2 className="font-sans text-3xl font-bold text-foreground">
          What&apos;s New at Guffs
        </h2>
      </div>
      <div className="rounded-xl border border-border/50 bg-card shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="relative w-full md:w-[40%] aspect-[3/4] md:aspect-auto md:min-h-[280px] bg-secondary/30 shrink-0">
          <Image
            src={data.imagePath}
            alt="Featured bottle"
            fill
            className="object-contain object-center p-4"
            sizes="(max-width: 768px) 100vw, 40vw"
          />
        </div>
        <div className="flex-1 p-6 md:p-8 flex flex-col justify-center">
          <p className="font-sans text-card-foreground/90 leading-relaxed whitespace-pre-line">
            {data.description}
          </p>
        </div>
      </div>
    </section>
  );
}
