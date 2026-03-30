import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const schema = z.object({
  bucket: z.enum(["avatars", "portfolio"]),
  fileName: z.string().min(1),
  contentType: z.string(),
});

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const { bucket, fileName, contentType } = parsed.data;
  const ext = fileName.split(".").pop() ?? "jpg";
  const path = `${session.id}/${Date.now()}.${ext}`;

  const supabase = await createClient();
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUploadUrl(path);

  if (error || !data) {
    console.error("Supabase storage error:", error);
    return NextResponse.json({ error: "Failed to create upload URL" }, { status: 500 });
  }

  const { data: { publicUrl } } = supabase.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json({
    signedUrl: data.signedUrl,
    publicUrl,
    path,
  });
}
