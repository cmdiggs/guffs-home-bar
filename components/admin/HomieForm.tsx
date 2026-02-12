"use client";

import { useState } from "react";

type Homie = { id: number; name: string; title: string; description: string; imagePath: string | null };

function isHeic(file: File): boolean {
  const t = file.type?.toLowerCase() ?? "";
  const n = file.name?.toLowerCase() ?? "";
  return t === "image/heic" || t === "image/heif" || n.endsWith(".heic") || n.endsWith(".heif");
}

async function convertHeicToJpeg(file: File): Promise<File> {
  try {
    // Dynamic import to avoid SSR issues
    const heic2any = (await import("heic2any")).default;

    const convertedBlob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 0.9,
    });
    const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
    const newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");
    return new File([blob], newFileName, { type: "image/jpeg" });
  } catch (error) {
    console.error("HEIC conversion failed:", error);
    throw new Error("Failed to convert HEIC image");
  }
}

export function HomieForm({ homie, onDone }: { homie?: Homie; onDone?: () => void }) {
  const [name, setName] = useState(homie?.name ?? "");
  const [description, setDescription] = useState(homie?.description ?? "");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      let fileToUpload = file;

      // Convert HEIC to JPEG if needed
      if (file && isHeic(file)) {
        try {
          fileToUpload = await convertHeicToJpeg(file);
        } catch (error) {
          setError(error instanceof Error ? error.message : "Failed to convert HEIC image");
          setLoading(false);
          return;
        }
      }

      const formData = new FormData();
      formData.append("name", name.trim());
      formData.append("description", description.trim());
      if (fileToUpload) formData.append("file", fileToUpload);

      const url = homie ? `/api/admin/homies/${homie.id}` : "/api/admin/homies";
      const method = homie ? "PATCH" : "POST";

      const res = await fetch(url, { method, body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed.");
        return;
      }
      setName("");
      setDescription("");
      setFile(null);
      onDone?.();
      window.location.reload();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-6 rounded-xl border border-black/10 bg-white p-4 shadow-sm">
      <h2 className="font-display text-lg text-ink">{homie ? "Edit homie" : "Add homie"}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block font-sans text-sm font-medium text-ink mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded border border-black/15 px-3 py-2 font-sans text-ink"
          />
        </div>
      </div>
      <div className="mt-3">
        <label className="block font-sans text-sm font-medium text-ink mb-1">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={2}
          className="w-full rounded border border-black/15 px-3 py-2 font-sans text-ink"
        />
      </div>
      <div className="mt-3">
        <label className="block font-sans text-sm font-medium text-ink mb-1">Image (optional)</label>
        <input
          type="file"
          accept="image/*,image/heic,image/heif,.heic,.heif"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="w-full font-sans text-sm text-ink"
        />
        {homie && <p className="mt-1 font-sans text-xs text-ink/60">Leave empty to keep current.</p>}
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-ink px-4 py-2 font-sans text-sm font-medium text-cream hover:bg-ink/90 disabled:opacity-60"
        >
          {loading ? "Saving…" : homie ? "Update" : "Add"}
        </button>
        {homie && onDone && (
          <button type="button" onClick={onDone} className="rounded border border-black/20 px-4 py-2 font-sans text-sm text-ink">
            Cancel
          </button>
        )}
      </div>
      {error && <p className="mt-2 font-sans text-sm text-red-600">{error}</p>}
    </form>
  );
}
