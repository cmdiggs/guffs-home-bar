"use client";

import Link from "next/link";
import { CocktailBookList } from "@/components/CocktailBookList";

export default function CocktailBookPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="relative z-10 bg-card min-h-screen">
        <section className="container mx-auto px-4 py-12" id="cocktails">
          <div className="flex items-center gap-3 mb-8">
            <svg className="h-6 w-6 text-accent shrink-0" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
              <rect x="4" y="2" width="16" height="4" />
              <rect x="6" y="6" width="12" height="4" />
              <rect x="8" y="10" width="8" height="4" />
              <rect x="10" y="14" width="4" height="6" />
              <rect x="8" y="20" width="8" height="2" />
            </svg>
            <h1 className="font-sans text-3xl font-bold text-foreground">
              Guffs&apos; Cocktails
            </h1>
          </div>

          <p className="text-muted-foreground mb-8 max-w-xl">
            Our house recipes and favorites. Click View Cocktail to see the full recipe.
          </p>

          <CocktailBookList />

          <div className="mt-10">
            <Link
              href="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded"
            >
              ← Back to home
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
