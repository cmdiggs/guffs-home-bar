"use client";

import { useState } from "react";
import Image from "next/image";
import type { Memorabilia } from "@/lib/db";
import { MemorabiliaForm } from "./MemorabiliaForm";

export function MemorabiliaList({ initialItems }: { initialItems: Memorabilia[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<Memorabilia | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/admin/memorabilia/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleMove(index: number, direction: "up" | "down") {
    const newOrder = [...items];
    const swap = direction === "up" ? index - 1 : index + 1;
    if (swap < 0 || swap >= newOrder.length) return;
    [newOrder[index], newOrder[swap]] = [newOrder[swap], newOrder[index]];
    const ids = newOrder.map((i) => i.id);
    const res = await fetch("/api/admin/memorabilia/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (res.ok) setItems(newOrder);
  }

  return (
    <div className="mt-8">
      <h2 className="font-display text-lg text-ink">All items</h2>
      {editing ? (
        <MemorabiliaForm item={editing} onDone={() => setEditing(null)} />
      ) : null}
      <ul className="mt-4 space-y-4">
        {items.map((i, index) => (
          <li
            key={i.id}
            className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
          >
            <div className="flex shrink-0 flex-col gap-0.5">
              <button
                type="button"
                onClick={() => handleMove(index, "up")}
                disabled={index === 0}
                className="rounded border border-black/20 p-1.5 text-ink hover:bg-black/5 disabled:opacity-40"
                aria-label="Move up"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" /></svg>
              </button>
              <button
                type="button"
                onClick={() => handleMove(index, "down")}
                disabled={index === items.length - 1}
                className="rounded border border-black/20 p-1.5 text-ink hover:bg-black/5 disabled:opacity-40"
                aria-label="Move down"
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
            </div>
            <div className="relative h-24 w-32 shrink-0 overflow-hidden rounded bg-black/5">
              <Image src={i.imagePath} alt={i.title} fill className="object-cover" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg text-ink">{i.title}</p>
              <p className="font-sans text-sm text-ink/70 line-clamp-2">{i.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(i)}
                className="rounded border border-black/20 px-3 py-1.5 font-sans text-sm text-ink hover:bg-black/5"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(i.id)}
                className="rounded border border-red-200 px-3 py-1.5 font-sans text-sm text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 && !editing && (
        <p className="font-sans text-ink/60">No memorabilia yet. Add one above.</p>
      )}
    </div>
  );
}
