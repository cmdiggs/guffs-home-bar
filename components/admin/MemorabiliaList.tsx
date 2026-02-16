"use client";

import { useState } from "react";
import type { Memorabilia } from "@/lib/db";
import { MemorabiliaForm } from "./MemorabiliaForm";
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

export function MemorabiliaList({ initialItems }: { initialItems: Memorabilia[] }) {
  const [items, setItems] = useState(initialItems);
  const [editing, setEditing] = useState<Memorabilia | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  async function handleDelete(id: number) {
    if (!confirm("Delete this item?")) return;
    const res = await fetch(`/api/admin/memorabilia/${id}`, { method: "DELETE" });
    if (res.ok) setItems((prev) => prev.filter((i) => i.id !== id));
  }

  async function handleRotate(id: number, currentRotation: number) {
    const next = (currentRotation + 90) % 360;
    const res = await fetch(`/api/admin/memorabilia/${id}/rotate`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageRotation: next }),
    });
    if (res.ok) {
      const updated = await res.json();
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, imageRotation: updated.imageRotation ?? next } : i)));
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? `Rotate failed (${res.status})`);
    }
  }

  async function handleReorder(fromIndex: number, toIndex: number) {
    if (fromIndex === toIndex) return;
    const newOrder = [...items];
    const [removed] = newOrder.splice(fromIndex, 1);
    newOrder.splice(toIndex, 0, removed);
    const ids = newOrder.map((i) => i.id);
    const res = await fetch("/api/admin/memorabilia/reorder", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids }),
    });
    if (res.ok) {
      setItems(newOrder);
    } else {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? `Reorder failed (${res.status})`);
    }
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
      <h2 className="font-display text-lg text-ink">All items</h2>
      {editing ? (
        <MemorabiliaForm item={editing} onDone={() => setEditing(null)} />
      ) : null}
      <p className="mt-1 font-sans text-sm text-ink/60">Drag rows to reorder.</p>
      <ul className="mt-4 space-y-4">
        {items.map((i, index) => (
          <li
            key={i.id}
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
                src={i.imagePath}
                alt={i.title}
                rotation={(i as Memorabilia).imageRotation ?? 0}
                sizes="128px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-display text-lg text-ink">{i.title}</p>
              <p className="font-sans text-sm text-ink/70 line-clamp-2">{i.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleRotate(i.id, (i as Memorabilia).imageRotation ?? 0)}
                className="rounded border border-black/20 px-3 py-1.5 font-sans text-sm text-ink hover:bg-black/5"
                title="Rotate image 90°"
              >
                Rotate
              </button>
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
