"use client";

import { useState } from "react";
import Image from "next/image";
import type { Homie } from "@/lib/db";
import { HomieForm } from "./HomieForm";

export function HomiesList({ initialHomies }: { initialHomies: Homie[] }) {
  const [homies, setHomies] = useState(initialHomies);
  const [editing, setEditing] = useState<Homie | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this homie?")) return;
    const res = await fetch(`/api/admin/homies/${id}`, { method: "DELETE" });
    if (res.ok) setHomies((prev) => prev.filter((h) => h.id !== id));
  }

  return (
    <div className="mt-8">
      <h2 className="font-display text-lg text-ink">All homies</h2>
      {editing ? <HomieForm homie={editing} onDone={() => setEditing(null)} /> : null}
      <ul className="mt-4 space-y-4">
        {homies.map((h) => (
          <li
            key={h.id}
            className="flex flex-col gap-3 rounded-xl border border-black/10 bg-white p-4 shadow-sm sm:flex-row sm:items-center"
          >
            {h.imagePath ? (
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded bg-black/5">
                <Image src={h.imagePath} alt={h.name} fill className="object-cover" />
              </div>
            ) : (
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded bg-black/5 font-display text-2xl text-ink/40">
                {h.name.charAt(0)}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg text-ink">{h.name}</p>
              <p className="font-sans text-sm text-ink/70">{h.title}</p>
              <p className="font-sans text-sm text-ink/70 line-clamp-1">{h.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setEditing(h)}
                className="rounded border border-black/20 px-3 py-1.5 font-sans text-sm text-ink hover:bg-black/5"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => handleDelete(h.id)}
                className="rounded border border-red-200 px-3 py-1.5 font-sans text-sm text-red-700 hover:bg-red-50"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
      {homies.length === 0 && !editing && (
        <p className="font-sans text-ink/60">No homies yet. Add one above.</p>
      )}
    </div>
  );
}
