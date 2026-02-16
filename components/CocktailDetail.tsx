"use client";

import { useEffect } from "react";
import Image from "next/image";
import type { Cocktail } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = { cocktail: Cocktail; onClose: () => void };

export function CocktailDetail({ cocktail, onClose }: Props) {
  const hasImage = cocktail.imagePath && cocktail.imagePath !== "/guffs-logo.svg";
  const ingredients = cocktail.ingredients
    ? cocktail.ingredients
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .map((s) => s.replace(/^[•\-]\s*/, ""))
    : [];

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="cocktail-title"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-hidden rounded-2xl bg-card shadow-xl">
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 z-10 rounded-full bg-secondary p-2 text-foreground hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Close"
        >
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {hasImage && (
          <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
            <div className="h-full w-full" style={{ transform: `rotate(${cocktail.imageRotation ?? 0}deg)`, transformOrigin: "center center" }}>
              <Image
                src={cocktail.imagePath}
                alt={cocktail.name}
                fill
                className="object-cover"
                sizes="512px"
              />
            </div>
          </div>
        )}
        <CardHeader>
          <div className="flex items-start justify-between gap-2">
            <CardTitle id="cocktail-title" className="font-sans text-2xl">
              {cocktail.name}
            </CardTitle>
            {cocktail.friendName && (
              <Badge variant="secondary" className="shrink-0">
                {cocktail.friendName}
              </Badge>
            )}
          </div>
          {cocktail.description && (
            <CardDescription className="text-base leading-relaxed">
              {cocktail.description}
            </CardDescription>
          )}
        </CardHeader>
        {ingredients.length > 0 && (
          <CardContent>
            <p className="text-sm font-medium text-foreground">Ingredients:</p>
            <ul className="mt-1 text-sm text-muted-foreground space-y-0.5 columns-2 gap-x-4">
              {ingredients.map((ingredient, idx) => (
                <li key={idx}>• {ingredient}</li>
              ))}
            </ul>
          </CardContent>
        )}
      </div>
    </div>
  );
}
