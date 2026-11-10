import { Suspense } from "react";
import { PropertyDetailClient } from "@/components/property-detail-client";

export default function PropertyDetailPage({ params }: PageProps<"/properties/[id]">) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#F7F9FC]" aria-label="Loading property details" />}>
      {params.then(({ id }) => <PropertyDetailClient id={id} />)}
    </Suspense>
  );
}
