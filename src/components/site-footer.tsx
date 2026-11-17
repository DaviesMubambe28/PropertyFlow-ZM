import Link from "next/link";
import { Building2 } from "lucide-react";

const linkGroups = [
  {
    title: "Platform",
    links: [
      { label: "Features", href: "/features" },
      { label: "Pricing", href: "/pricing" },
      { label: "Property listings", href: "/properties" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Real estate agencies", href: "/#solutions" },
      { label: "Independent agents", href: "/#solutions" },
      { label: "Landlords", href: "/#solutions" },
    ],
  },
  {
    title: "Company & support",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-[#E5EAF0] bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3 text-[#17212F]">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#142A43] text-white">
                <Building2 className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold">PropertyFlow ZM</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-[#667085]">
              A clearer way for Zambian property businesses to organise listings, client follow-ups and deal workflows.
            </p>
            <p className="mt-4 text-xs leading-5 text-[#667085]">
              Account, agency, property, CRM, task, viewing, and deal records use the shared secure workspace. Payments and public enquiries are not connected.
            </p>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-[#17212F]">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-[#667085] transition hover:text-[#142A43]">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-[#E5EAF0] pt-5 text-xs text-[#667085] sm:flex-row sm:items-center sm:justify-between">
          <p>© PropertyFlow ZM</p>
          <p>Designed for property businesses in Zambia.</p>
        </div>
      </div>
    </footer>
  );
}
