import { z } from "zod";
import { propertyFilesBucket, propertyFileTitle } from "@/lib/property-files";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const file = new URL(request.url).searchParams.get("file");
  if (!z.uuid().safeParse(id).success || !file || !/^[a-f0-9-]{36}--[a-zA-Z0-9 _-]{1,90}\.(pdf|jpg|png|webp)$/.test(file)) {
    return new Response("File not found.", { status: 404 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return new Response("Sign in to access this file.", { status: 401 });

  const { data, error } = await supabase.storage.from(propertyFilesBucket).createSignedUrl(`${id}/${file}`, 60, {
    download: propertyFileTitle(file),
  });
  if (error || !data?.signedUrl) return new Response("File not found.", { status: 404 });

  return new Response(null, { status: 302, headers: { Location: data.signedUrl, "Cache-Control": "private, no-store" } });
}
