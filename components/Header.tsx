import Image from "next/image";
import Link from "next/link";

const TAGLINE = "Welcome to Guffs. A Familiar Place, Every Time";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-cream/95 backdrop-blur supports-[backdrop-filter]:bg-cream/80">
      <div className="mx-auto flex max-w-4xl flex-col items-center gap-2 px-4 py-4 text-center md:flex-row md:justify-between md:gap-4 md:text-left">
        <Link href="/" className="flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 rounded">
          <div className="relative h-10 w-[120px] shrink-0 md:h-12 md:w-[140px]">
            <Image src="/guffs-logo.svg" alt="Guffs" fill className="object-contain object-left" priority />
          </div>
        </Link>
        <p className="font-sans text-sm text-ink/80 max-w-xs">{TAGLINE}</p>
      </div>
    </header>
  );
}
