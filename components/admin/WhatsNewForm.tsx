"use client";

import { useState } from "react";
import type { WhatsNew } from "@/lib/db";

export function WhatsNewForm({ initial }: { initial: WhatsNew | null }) {
  const [description, setDescription] = useState(initial?.description ?? "");
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

      const res = await fetch("/api/admin/whats-new", { method: "PATCH", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed.");
        return;
      }
      setFile(null);
      window.location.reload();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="font-display text-lg text-ink">What&apos;s New at Guffs</h2>
      <p className="mt-1 font-sans text-sm text-ink/70">Update the featured bottle and description shown on the homepage.</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block font-sans text-sm font-medium text-ink mb-1">Bottle image</label>
          <input
            type="file"
            accept="image/*,image/heic,image/heif,.heic,.heif"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full font-sans text-sm text-ink"
          />
          {initial && <p className="mt-1 font-sans text-xs text-ink/60">Leave empty to keep current image.</p>}
          {!initial && <p className="mt-1 font-sans text-xs text-ink/60">Required for first setup.</p>}
        </div>
        <div>
          <label className="block font-sans text-sm font-medium text-ink mb-1">Description</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            rows={4}
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
          {loading ? "Saving…" : "Update"}
        </button>
      </div>
      {error && <p className="mt-2 font-sans text-sm text-red-600">{error}</p>}
    </form>
  );
}
