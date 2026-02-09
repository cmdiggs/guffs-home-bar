import Image from "next/image";
import type { Cocktail } from "@/lib/db";

type Props = { cocktail: Cocktail; onClick: () => void };

export function CocktailCard({ cocktail, onClick }: Props) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group w-full text-left rounded-xl border border-black/10 bg-white shadow-sm overflow-hidden transition shadow hover:shadow-md focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
    >
      <div className="relative aspect-[4/3] bg-black/5">
        <Image
          src={cocktail.imagePath}
          alt={cocktail.name}
          fill
          className="object-cover transition group-hover:scale-[1.02]"
          sizes="(max-width: 768px) 100vw, 320px"
        />
      </div>
      <div className="p-4">
        <h3 className="font-display text-xl text-ink">{cocktail.name}</h3>
        {cocktail.friendName && (
          <p className="mt-0.5 font-sans text-sm text-ink/70">{cocktail.friendName}</p>
        )}
        <p className="mt-1 line-clamp-2 font-sans text-sm text-ink/70">{cocktail.description}</p>
      </div>
    </button>
  );
}
