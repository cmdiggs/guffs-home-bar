"use client";

import { useState } from "react";

type Cocktail = {
  id: number;
  name: string;
  description: string;
  imagePath: string;
  friendName?: string | null;
  ingredients?: string | null;
};

export function CocktailForm({ cocktail, onDone }: { cocktail?: Cocktail; onDone?: () => void }) {
  const [name, setName] = useState(cocktail?.name ?? "");
  const [description, setDescription] = useState(cocktail?.description ?? "");
  const [friendName, setFriendName] = useState(cocktail?.friendName ?? "");
  const [ingredients, setIngredients] = useState(cocktail?.ingredients ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("description", description.trim());
    if (friendName.trim()) formData.append("friendName", friendName.trim());
    if (ingredients.trim()) formData.append("ingredients", ingredients.trim());
    const url = cocktail
      ? `/api/admin/cocktails/${cocktail.id}`
      : "/api/admin/cocktails";
    const method = cocktail ? "PATCH" : "POST";
    try {
      const res = await fetch(url, { method, body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Failed.");
        return;
      }
      setName("");
      setDescription("");
      setFriendName("");
      setIngredients("");
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
      <h2 className="font-display text-lg text-ink">{cocktail ? "Edit cocktail" : "Add cocktail"}</h2>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="block font-sans text-sm font-medium text-ink mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Cocktail name"
            className="w-full rounded border border-black/15 px-3 py-2 font-sans text-ink"
          />
        </div>
        <div>
          <label className="block font-sans text-sm font-medium text-ink mb-1">Friend (optional)</label>
          <input
            type="text"
            value={friendName}
            onChange={(e) => setFriendName(e.target.value)}
            placeholder="Friend"
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
        <label className="block font-sans text-sm font-medium text-ink mb-1 animate-blink">Ingredients (optional, one per line)</label>
        <textarea
          value={ingredients}
          onChange={(e) => setIngredients(e.target.value)}
          rows={3}
          placeholder=""
          className="w-full rounded border border-black/15 px-3 py-2 font-sans text-ink"
        />
      </div>
      <div className="mt-3 flex gap-2">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-ink px-4 py-2 font-sans text-sm font-medium text-cream hover:bg-ink/90 disabled:opacity-60"
        >
          {loading ? "Saving…" : cocktail ? "Update" : "Add"}
        </button>
        {cocktail && onDone && (
          <button type="button" onClick={onDone} className="rounded border border-black/20 px-4 py-2 font-sans text-sm text-ink">
            Cancel
          </button>
        )}
      </div>
      {error && <p className="mt-2 font-sans text-sm text-red-600">{error}</p>}
    </form>
  );
}
