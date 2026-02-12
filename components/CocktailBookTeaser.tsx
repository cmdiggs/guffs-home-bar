import Link from "next/link";

export function CocktailBookTeaser() {
  return (
    <section className="container mx-auto px-4 py-12" id="cocktails">
      <div className="flex items-center gap-3 mb-6">
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
      <p className="text-muted-foreground mb-6 max-w-xl">
        Our house recipes and favorites.
      </p>
      <Link
        href="/cocktails"
        className="inline-flex items-center justify-center h-10 px-4 py-2 rounded-md text-sm font-medium border border-input bg-background hover:bg-accent hover:text-accent-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        View the cocktail book
      </Link>
    </section>
  );
}
