"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? "Login failed.");
        return;
      }
      router.push("/admin");
      router.refresh();
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full bg-cream">
      <div className="mx-auto flex min-h-screen max-w-sm flex-col justify-center px-4">
      <h1 className="font-sans text-2xl text-ink">Admin</h1>
      <p className="mt-1 font-sans text-ink/70">Sign in to manage content.</p>
      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <div>
          <label htmlFor="password" className="block font-sans text-sm font-medium text-ink mb-1">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            className="w-full rounded-lg border border-black/15 bg-white px-3 py-2 font-sans text-ink focus:border-ink focus:outline-none focus:ring-1 focus:ring-ink"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-ink py-3 font-sans font-medium text-cream hover:bg-ink/90 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 disabled:opacity-60"
        >
          {loading ? "Signing in…" : "Sign in"}
        </button>
        {error && <p className="font-sans text-sm text-red-600" role="alert">{error}</p>}
      </form>
      <Link href="/" className="mt-6 font-sans text-sm text-ink/70 hover:text-ink">
        ← Back to Guffs
      </Link>
      </div>
    </div>
  );
}
