"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function isHeic(file: File): boolean {
  const t = file.type?.toLowerCase() ?? "";
  const n = file.name?.toLowerCase() ?? "";
  return t === "image/heic" || t === "image/heif" || n.endsWith(".heic") || n.endsWith(".heif");
}

const CameraIcon = () => <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 13v7a2 2 0 01-2 2H7a2 2 0 01-2-2v-7" /></svg>;
const UploadIcon = () => <svg className="h-10 w-10 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>;
const XIcon = () => <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;

export function UploadForm() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [guestName, setGuestName] = useState("");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreviewLoading(true);
    setPreview(null);

    try {
      if (isHeic(f)) {
        // HEIC files will be converted on the server - no preview needed
        setPreview(null);
        setPreviewLoading(false);
      } else {
        const reader = new FileReader();
        reader.onloadend = () => {
          const result = reader.result as string | null;
          if (result) setPreview(result);
          setPreviewLoading(false);
        };
        reader.onerror = () => setPreviewLoading(false);
        reader.readAsDataURL(f);
        return;
      }
    } catch {
      setPreview(null);
      setPreviewLoading(false);
    }
    setPreviewLoading(false);
  }

  function clearPreview() {
    if (preview?.startsWith("blob:")) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file) {
      setStatus("error");
      setMessage("Please select a photo first.");
      return;
    }
    setStatus("uploading");
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    if (guestName.trim()) formData.append("guestName", guestName.trim());
    if (comment.trim()) formData.append("comment", comment.trim());
    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Upload failed.");
        return;
      }
      setStatus("success");
      setMessage("Photo uploaded! It will appear after approval.");
      clearPreview();
      setGuestName("");
      setComment("");
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <Card className="border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-sans text-2xl">
          <CameraIcon />
          Share Your Visit
        </CardTitle>
        <CardDescription className="text-base">
          Capture your moment at Guffs and share it with us
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="photo">Photo</Label>
            <input
              id="photo"
              ref={inputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/heic,image/heif,.heic,.heif"
              capture="environment"
              onChange={handleFileChange}
              className="hidden"
            />
            {previewLoading ? (
              <div className="w-full h-64 flex items-center justify-center rounded-lg bg-muted/50 text-muted-foreground text-sm">
                Loading preview…
              </div>
            ) : preview ? (
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2"
                  onClick={clearPreview}
                >
                  <XIcon />
                </Button>
              </div>
            ) : (
              <div
                className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer"
                onClick={() => inputRef.current?.click()}
              >
                <div className="flex flex-col items-center gap-2">
                  <UploadIcon />
                  <span className="text-sm text-muted-foreground">
                    Tap to capture or upload a photo
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="guestName">Your Name (Optional)</Label>
            <Input
              id="guestName"
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              placeholder="Enter your name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment">Comment (Optional)</Label>
            <Input
              id="comment"
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about Guffs..."
            />
          </div>

          {message && (
            <div
              className={`p-3 rounded-lg text-sm ${
                status === "success"
                  ? "bg-green-500/20 text-green-200 border border-green-500/50"
                  : "bg-destructive/20 text-destructive-foreground border border-destructive/50"
              }`}
            >
              {message}
            </div>
          )}

          <Button
            type="submit"
            className="w-full"
            disabled={status === "uploading" || !file}
          >
            {status === "uploading" ? "Uploading…" : "Upload Photo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
