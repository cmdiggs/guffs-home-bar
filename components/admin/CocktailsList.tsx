"use client";

import { useState } from "react";
import Image from "next/image";
import type { Cocktail } from "@/lib/db";
import { CocktailForm } from "./CocktailForm";
import { AdminImageWithRotation } from "./AdminImageWithRotation";

const GripIcon = () => (
  <svg className="h-5 w-5 text-ink/50" fill="currentColor" viewBox="0 0 24 24" aria-hidden>
    <circle cx="9" cy="6" r="1.5" />
    <circle cx="9" cy="12" r="1.5" />
    <circle cx="9" cy="18" r="1.5" />
    <circle cx="15" cy="6" r="1.5" />
    <circle cx="15" cy="12" r="1.5" />
    <circle cx="15" cy="18" r="1.5" />
  </svg>
);

export function CocktailsList({ initialCocktails }: { initialCocktails: Cocktail[] }) {
  const [cocktails, setCocktails] = useState(initialCocktails);
  const [editing, setEditing] = useState<Cocktail | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this cocktail?")) return;
    const res = await fetch(`/api/admin/cocktails/${id}`, { method: "DELETE" });
    if (res.ok) setCocktails((prev) => prev.filter((c) => c.id !== id));
  }

  async function handleRotate(id: number, currentRotation: number) {
    const next = (currentRotation + 90) % 360;
    const res = await fetch(`/api/admin/cocktails/${id}/rotate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageRotation: next }),
    });
    if (res.ok) {
      const updated = await res.json();
      setCocktails((prev) => prev.map((c) => (c.id === id ? { ...c, imageRotation: updated.imageRotation ?? next } : c)));
    }
  }

  async function handleReorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const newOrder = [...cocktails];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    const ids = newOrder.map((c) => c.id);
    const res = await fetch("/api/admin/cocktails/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (res.ok) setCocktails(newOrder);
  }

  function onDragStart(e: React.DragEvent, index: number) {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(index));
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  function onDrop(e: React.DragEvent, dropIndex: number) {
    e.preventDefault();
    setDraggedIndex(null);
    const fromIndex = draggedIndex ?? parseInt(e.dataTransfer.getData("text/plain"), 10);
    if (Number.isNaN(fromIndex) || fromIndex === dropIndex) return;
    handleReorder(fromIndex, dropIndex);
  }

  function onDragEnd() {
    setDraggedIndex(null);
  }

  return (
    <div className="mt-8">
      <h2 className="font-display text-lg text-ink">All cocktails</h2>
      {editing ? (
        <CocktailForm cocktail={editing} onDone={() => setEditing(null)} />
      ) : null}
      <p className="mt-1 font-sans text-sm text-ink/60">Drag rows to reorder.</p>
      <ul className="mt-4 space-y-4">
        {cocktails.map((c, index) => (
          <li
            key={c.id}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragOver={onDragOver}
            onDrop={(e) => onDrop(e, index)}
            onDragEnd={onDragEnd}
            className={`flex cursor-grab flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm transition-opacity active:cursor-grabbing sm:flex-row sm:items-center ${draggedIndex === index ? "opacity-50" : ""}`}
          >
            <div className="flex shrink-0 items-center pr-2" aria-label="Drag to reorder">
              <GripIcon />
            </div>
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded bg-black/5">
              <AdminImageWithRotation
                src={c.imagePath}
                alt={c.name}
                rotation={(c as Cocktail).imageRotation ?? 0}
                sizes="128px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg text-ink">{c.name}</p>
              <p className="font-sans text-sm text-ink/70 line-clamp-2">{c.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleRotate(c.id, (c as Cocktail).imageRotation ?? 0)}
                className="rounded border border-black/20 px-3 py-1.5 font-sans text-sm text-ink hover:bg-black/5"
                title="Rotate image 90°"
              >
                Rotate
              </button>
              <button
                type="button"
                onClick={() => setEditing(c)}
                className="rounded border border-black/20 px-3 py-1.5 font-sans text-sm text-ink hover:bg-black/5"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(c.id)}
                className="rounded border border-red-200 px-3 py-1.5 font-sans text-sm text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {cocktails.length === 0 && !editing && (
        <p className="font-sans text-ink/60">No cocktails yet. Add one above.</p>
      )}
    </div>
  );
}
