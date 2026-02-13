"use client";

import { useState } from "react";
import type { Submission } from "@/lib/db";
import { AdminImageWithRotation } from "./AdminImageWithRotation";

const statusLabels: Record<string, string> = {
  pending: "Pending",
  approved: "Approved",
  denied: "Denied",
};

export function SubmissionsList({ initialSubmissions }: { initialSubmissions: Submission[] }) {
  const [submissions, setSubmissions] = useState(initialSubmissions);

  async function setStatus(id: number, status: "approved" | "denied") {
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (!res.ok) return;
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  }

  async function handleRotate(id: number, currentRotation: number) {
    const next = (currentRotation + 90) % 360;
    const res = await fetch(`/api/admin/submissions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageRotation: next }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      alert(err?.error ?? `Rotate failed (${res.status})`);
      return;
    }
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, imageRotation: next } : s))
    );
  }

  async function trashPhoto(id: number) {
    if (!confirm("Delete this photo permanently? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/submissions/${id}`, { method: "DELETE" });
    if (!res.ok) return;
    setSubmissions((prev) => prev.filter((s) => s.id !== id));
  }

  if (submissions.length === 0) {
    return <p className="mt-6 font-sans text-ink/60">No submissions yet.</p>;
  }
  return (
    <ul className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {submissions.map((s) => (
        <li key={s.id} className="rounded-xl border border-black/10 bg-white overflow-hidden shadow-sm">
          <a href={s.imagePath} target="_blank" rel="noopener noreferrer" className="block">
            <div className="relative aspect-[4/3] bg-black/5">
              <AdminImageWithRotation
                src={s.imagePath}
                alt={s.guestName ?? s.caption ?? "Guest photo"}
                rotation={s.imageRotation ?? 0}
                sizes="(max-width: 768px) 100vw, 320px"
              />
              <span
                className={`absolute top-2 right-2 rounded px-2 py-0.5 font-sans text-xs font-medium ${
                  s.status === "approved"
                    ? "bg-green-100 text-green-800"
                    : s.status === "denied"
                    ? "bg-red-100 text-red-800"
                    : "bg-amber-100 text-amber-800"
                }`}
              >
                {statusLabels[s.status] ?? s.status}
              </span>
            </div>
          </a>
          <div className="p-3">
            {s.guestName && <p className="font-sans text-sm font-medium text-ink/80">{s.guestName}</p>}
            {s.comment && <p className="font-sans text-sm text-ink/80">{s.comment}</p>}
            {!s.guestName && !s.comment && s.caption && <p className="font-sans text-sm text-ink/80">{s.caption}</p>}
            <p className="font-sans text-xs text-ink/50 mt-1">
              {new Date(s.createdAt).toLocaleDateString()}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {(s.status === "pending" || s.status === "approved" || s.status === "denied") && (
                <>
                  {(s.status === "pending" || s.status === "denied") && (
                    <button
                      type="button"
                      onClick={() => setStatus(s.id, "approved")}
                      className="font-sans text-sm text-green-700 hover:underline"
                    >
                      Approve
                    </button>
                  )}
                  {(s.status === "pending" || s.status === "approved") && (
                    <button
                      type="button"
                      onClick={() => setStatus(s.id, "denied")}
                      className="font-sans text-sm text-red-700 hover:underline"
                    >
                      Deny
                    </button>
                  )}
                  <span className="text-ink/30">|</span>
                </>
              )}
              <button
                type="button"
                onClick={() => trashPhoto(s.id)}
                className="font-sans text-sm text-ink/60 hover:text-red-600 hover:underline"
                title="Delete photo"
              >
                Trash
              </button>
              <span className="text-ink/30">|</span>
              <button
                type="button"
                onClick={() => handleRotate(s.id, s.imageRotation ?? 0)}
                className="font-sans text-sm text-ink/60 hover:text-ink hover:underline"
                title="Rotate image 90°"
              >
                Rotate
              </button>
              <span className="text-ink/30">|</span>
              <a
                href={s.imagePath}
                download
                className="font-sans text-sm text-ink underline hover:no-underline"
              >
                Download
              </a>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
