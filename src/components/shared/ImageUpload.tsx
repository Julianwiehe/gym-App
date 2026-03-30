"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  currentUrl?: string | null;
  onUploadComplete: (url: string) => void;
  bucket?: string;
  className?: string;
  label?: string;
}

export function ImageUpload({
  currentUrl, onUploadComplete, bucket = "portfolio", className, label = "Upload Image",
}: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError("File must be under 5MB");
      return;
    }

    setUploading(true);
    setError("");

    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bucket, fileName: file.name, contentType: file.type }),
      });

      if (!res.ok) throw new Error("Failed to get upload URL");

      const { signedUrl, publicUrl } = await res.json();

      const uploadRes = await fetch(signedUrl, {
        method: "PUT",
        body: file,
        headers: { "Content-Type": file.type },
      });

      if (!uploadRes.ok) throw new Error("Upload failed");

      onUploadComplete(publicUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
      setPreview(currentUrl ?? null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className={cn("space-y-2", className)}>
      <div
        className={cn(
          "relative flex items-center justify-center rounded-lg border-2 border-dashed transition-colors cursor-pointer",
          preview ? "border-violet-300 bg-violet-50" : "border-slate-300 hover:border-violet-400",
          "min-h-[160px]"
        )}
        onClick={() => inputRef.current?.click()}
      >
        {preview ? (
          <>
            <Image src={preview} alt="Preview" fill className="object-cover rounded-lg" />
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); setPreview(null); }}
              className="absolute top-2 right-2 rounded-full bg-white/80 p-1 hover:bg-white"
            >
              <X className="h-4 w-4" />
            </button>
          </>
        ) : (
          <div className="text-center p-6">
            <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-slate-600">{uploading ? "Uploading..." : label}</p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP up to 5MB</p>
          </div>
        )}
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFile}
        disabled={uploading}
      />
    </div>
  );
}
