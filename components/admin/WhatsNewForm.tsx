"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { WhatsNew } from "@/lib/db";

export function WhatsNewForm({ item, onDone }: { item?: WhatsNew; onDone?: () => void }) {
  const router = useRouter();
  const [description, setDescription] = useState(item?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("description", description.trim());
      if (file) formData.append("file", file);

      const url = item ? `/api/admin/whats-new/${item.id}` : "/api/admin/whats-new";
      const method = item ? "PATCH" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed.");
        return;
      }
      setDescription("");
      setFile(null);
      onDone?.();
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="font-display text-lg text-ink">{item ? "Edit item" : "Add What\u2019s New"}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block font-sans text-sm font-medium text-ink mb-1">Bottle image</label>
          <input
            type="file"
            accept="image/*,image/heic,image/heif,.heic,.heif"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full font-sans text-sm text-ink"
          />
          {item && <p className="mt-1 font-sans text-xs text-ink/60">Leave empty to keep current image.</p>}
        </div>
        <div>
          <label className="block font-sans text-sm font-medium text-ink mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={3}
            className="w-full rounded border border-black/15 px-3 py-2 font-sans text-ink"
            placeholder="Describe the new bottle..."
          />
        </div>
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-ink px-4 py-2 font-sans text-sm font-medium text-cream hover:bg-ink/90 disabled:opacity-60"
        >
          {loading ? "Saving\u2026" : item ? "Update" : "Add"}
        </button>
        {item && onDone && (
          <button type="button" onClick={onDone} className="rounded border border-black/20 px-4 py-2 font-sans text-sm text-ink">
            Cancel
          </button>
        )}
      </div>
      {error && <p className="mt-2 font-sans text-sm text-red-600">{error}</p>}
    </form>
  );
}
