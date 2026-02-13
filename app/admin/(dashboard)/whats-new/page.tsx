import { getWhatsNew } from "@/lib/db";
import { WhatsNewForm } from "@/components/admin/WhatsNewForm";
import Image from "next/image";

export default async function AdminWhatsNewPage() {
  const whatsNew = await getWhatsNew();
  const whatsNewPlain = whatsNew ? (JSON.parse(JSON.stringify(whatsNew)) as typeof whatsNew) : null;
  return (
    <div>
      <h1 className="font-display text-2xl text-ink">What&apos;s New</h1>
      <p className="mt-1 font-sans text-ink/70">Set the featured bottle and description shown below the story on the homepage.</p>
      {whatsNewPlain && (
        <div className="mt-4 rounded-xl border border-black/10 bg-white overflow-hidden shadow-sm max-w-md">
          <div className="relative aspect-[3/4] bg-black/5">
            <Image
              src={whatsNewPlain.imagePath}
              alt="Current featured bottle"
              fill
              className="object-contain"
              sizes="400px"
            />
          </div>
          <p className="p-3 font-sans text-sm text-ink/80">{whatsNewPlain.description}</p>
        </div>
      )}
      <WhatsNewForm initial={whatsNewPlain} />
    </div>
  );
}
