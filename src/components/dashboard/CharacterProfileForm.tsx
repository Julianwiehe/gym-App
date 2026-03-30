"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ImageUpload } from "@/components/shared/ImageUpload";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileFormProps {
  profile: {
    id: string;
    name: string;
    tagline: string;
    bio: string;
    followerCount: number;
    engagementRate: number;
    isAvailable: boolean;
    categoryIds: string[];
    capabilityIds: string[];
    avatarUrl?: string;
  };
  categories: { id: string; name: string }[];
  capabilities: { id: string; name: string }[];
}

export function CharacterProfileForm({ profile, categories, capabilities }: ProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(profile.name);
  const [tagline, setTagline] = useState(profile.tagline);
  const [bio, setBio] = useState(profile.bio);
  const [followerCount, setFollowerCount] = useState(profile.followerCount);
  const [engagementRate, setEngagementRate] = useState(profile.engagementRate);
  const [isAvailable, setIsAvailable] = useState(profile.isAvailable);
  const [categoryIds, setCategoryIds] = useState<string[]>(profile.categoryIds);
  const [capabilityIds, setCapabilityIds] = useState<string[]>(profile.capabilityIds);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(profile.avatarUrl);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  function toggleCategory(id: string) {
    setCategoryIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }
  function toggleCapability(id: string) {
    setCapabilityIds((prev) => prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess(false);

    const res = await fetch("/api/characters", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name, tagline, bio, followerCount, engagementRate, isAvailable,
        categoryIds, capabilityIds, avatarUrl: avatarUrl ?? null,
      }),
    });

    if (!res.ok) {
      const body = await res.json();
      setError(body.error?.formErrors?.join(", ") ?? "Save failed");
    } else {
      setSuccess(true);
      router.refresh();
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSave} className="space-y-6">
      {error && <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
      {success && <div className="rounded-md bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">Profile saved!</div>}

      <Card>
        <CardHeader><CardTitle className="text-sm">Avatar</CardTitle></CardHeader>
        <CardContent>
          <ImageUpload
            currentUrl={avatarUrl}
            onUploadComplete={(url) => setAvatarUrl(url)}
            bucket="avatars"
            label="Upload Avatar"
            className="max-w-xs"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Basic Info</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Character Name</Label>
            <Input value={name} onChange={(e) => setName(e.target.value)} required minLength={2} />
          </div>
          <div className="space-y-2">
            <Label>Tagline</Label>
            <Input value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="A short, catchy description" />
          </div>
          <div className="space-y-2">
            <Label>Bio</Label>
            <Textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={4} placeholder="Tell companies about your AI persona, style, and what makes you unique..." />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="available"
              checked={isAvailable}
              onChange={(e) => setIsAvailable(e.target.checked)}
              className="rounded border-slate-300 text-violet-600"
            />
            <Label htmlFor="available">Available for bookings</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Stats</CardTitle></CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Follower Count</Label>
            <Input type="number" min={0} value={followerCount} onChange={(e) => setFollowerCount(Number(e.target.value))} />
          </div>
          <div className="space-y-2">
            <Label>Engagement Rate (%)</Label>
            <Input type="number" min={0} max={100} step={0.1} value={engagementRate} onChange={(e) => setEngagementRate(Number(e.target.value))} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Categories</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => toggleCategory(cat.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-sm border transition-colors",
                  categoryIds.includes(cat.id)
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white text-slate-700 border-slate-200 hover:border-violet-400"
                )}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm">Capabilities</CardTitle></CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {capabilities.map((cap) => (
              <button
                key={cap.id}
                type="button"
                onClick={() => toggleCapability(cap.id)}
                className={cn(
                  "rounded-full px-3 py-1 text-sm border transition-colors",
                  capabilityIds.includes(cap.id)
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-white text-slate-700 border-slate-200 hover:border-violet-400"
                )}
              >
                {cap.name}
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={saving} size="lg">
        {saving ? "Saving..." : "Save Profile"}
      </Button>
    </form>
  );
}
