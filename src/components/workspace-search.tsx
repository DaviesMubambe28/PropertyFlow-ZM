"use client";

import Link from "next/link";
import { useState } from "react";
import { Search } from "lucide-react";
import { useAppContext } from "@/components/app-provider";

export function WorkspaceSearch() {
  const { state, activeOrg } = useAppContext();
  const [query, setQuery] = useState("");
  const search = query.trim().toLowerCase();
  const organizationId = activeOrg?.id;
  const results = search.length >= 2 ? [
    ...state.properties.filter((record) => record.orgId === organizationId && record.status !== "archived" && `${record.title} ${record.location}`.toLowerCase().includes(search))
      .slice(0, 4).map((record) => ({ name: record.title, type: "Property", href: `/dashboard/properties#property-${record.id}` })),
    ...state.contacts.filter((record) => record.orgId === organizationId && `${record.name} ${record.email}`.toLowerCase().includes(search))
      .slice(0, 4).map((record) => ({ name: record.name, type: "Contact", href: `/dashboard/contacts#contact-${record.id}` })),
    ...state.leads.filter((record) => record.orgId === organizationId && record.title.toLowerCase().includes(search))
      .slice(0, 4).map((record) => ({ name: record.title, type: "Lead", href: `/dashboard/pipeline#lead-${record.id}` })),
  ] : [];

  return (
    <div className="relative mt-3 max-w-lg" onKeyDown={(event) => { if (event.key === "Escape") setQuery(""); }}>
      <label className="relative block">
        <span className="sr-only">Search agency records</span>
        <Search size={16} aria-hidden="true" className="pointer-events-none absolute left-3 top-3 text-quiet" />
        <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={120}
          placeholder="Search properties, contacts and leads" className="min-h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-3 text-sm" />
      </label>
      {search.length >= 2 && (
        <div className="absolute z-40 mt-1.5 max-h-72 w-full overflow-auto rounded-lg border border-line bg-white shadow-lg">
          {results.length > 0 ? (
            <ul aria-label="Workspace search results" className="divide-y divide-line">
              {results.map((result) => (
                <li key={result.href}>
                  <Link href={result.href} onClick={() => setQuery("")} className="flex min-h-11 items-center justify-between gap-3 px-3 py-2 text-sm hover:bg-tint">
                    <span className="min-w-0 break-words font-medium">{result.name}</span><span className="shrink-0 text-xs text-quiet">{result.type}</span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : <p role="status" className="p-3 text-sm text-quiet">No matching records.</p>}
        </div>
      )}
    </div>
  );
}
