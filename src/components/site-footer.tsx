import Link from "next/link";
import { Building2 } from "lucide-react";

const linkGroups = [
  {
    title: "Platform",
    links: [
      { label: "Features", href: "/features" },
      { label: "Enterprise", href: "/enterprise" },
      { label: "Pricing", href: "/pricing" },
      { label: "Property listings", href: "/properties" },
      { label: "Sign in", href: "/login" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Real estate agencies", href: "/solutions" },
      { label: "Independent agents", href: "/solutions" },

    ],
  },
  {
    title: "Company & support",
    links: [
      { label: "About", href: "/about" },
      { label: "Request a demo", href: "/contact" },
      { label: "Privacy policy", href: "/privacy" },
      { label: "Terms of service", href: "/terms" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 lg:py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center gap-3 text-ink">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-pine text-white">
                <Building2 className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="text-lg font-semibold">PropertyFlow ZM</span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-ink">
              A clearer way for Zambian property businesses to organise listings, client follow-ups and deal workflows.
            </p>
          </div>

          {linkGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-sm font-semibold text-ink">{group.title}</h2>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href} className="text-sm text-muted-ink transition hover:text-pine">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-line pt-5 text-xs text-muted-ink sm:flex-row sm:items-center sm:justify-between">
          <p>© PropertyFlow ZM</p>
          <p>Designed for property businesses in Zambia.</p>
        </div>
      </div>
    </footer>
  );
}
