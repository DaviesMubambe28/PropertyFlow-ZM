import Link from "next/link";
import { notFound } from "next/navigation";
import { z } from "zod";
import { DashboardShell } from "@/components/dashboard-shell";
import { PropertyFileUpload } from "@/components/property-file-upload";
import { propertyFilesBucket, propertyFileTitle } from "@/lib/property-files";
import { createClient } from "@/lib/supabase/server";

export const instant = false;

export default async function PropertyFilesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!z.uuid().safeParse(id).success) notFound();
  const supabase = await createClient();
  const { data: property, error } = await supabase.from("properties").select("title").eq("id", id).maybeSingle();
  if (error) throw new Error("Property files are temporarily unavailable.");
  if (!property) notFound();

  const { data: files, error: filesError } = await supabase.storage.from(propertyFilesBucket).list(id, {
    limit: 100, sortBy: { column: "created_at", order: "desc" },
  });

  return (
    <DashboardShell>
      <div className="max-w-4xl space-y-5">
        <Link href="/dashboard/properties" className="text-sm font-semibold text-brand underline">Back to portfolio</Link>
        <div><h2 className="text-2xl font-semibold">{property.title}</h2><p className="mt-1 text-sm text-quiet">Private photos and supporting documents</p></div>
        <PropertyFileUpload propertyId={id} />
        <section aria-label="Uploaded property files" className="rounded-lg border border-line bg-white p-5">
          {filesError && <p role="alert">Files could not be loaded. Try refreshing this page.</p>}
          {files?.length === 0 && <p className="text-sm text-quiet">No files have been uploaded.</p>}
          <ul className="divide-y divide-line">
            {files?.map((file) => (
              <li key={file.name} className="break-words py-3">
                <a href={`/dashboard/properties/${id}/files/download?file=${encodeURIComponent(file.name)}`} className="text-sm font-semibold text-brand underline">{propertyFileTitle(file.name)}</a>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </DashboardShell>
  );
}
