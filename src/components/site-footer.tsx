import Link from "next/link";
import { Building2 } from "lucide-react";

const linkGroups = [
  { title: "Platform", links: [{ label: "Features", href: "/features" }, { label: "Pricing", href: "/pricing" }, { label: "Property listings", href: "/properties" }] },
  { title: "Company", links: [{ label: "About", href: "/about" }, { label: "Enterprise", href: "/enterprise" }, { label: "Request a demo", href: "/contact" }] },
  { title: "Support", links: [{ label: "Sign in", href: "/login" }, { label: "Privacy policy", href: "/privacy" }, { label: "Terms of service", href: "/terms" }] },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-width grid grid-cols-2 gap-8 py-12 sm:grid-cols-4 sm:py-14">
        <div className="col-span-2 sm:col-span-1">
          <Link href="/" className="inline-flex items-center gap-2 font-bold tracking-tight">
            <Building2 size={23} aria-hidden="true" /> PropertyFlow ZM
          </Link>
          <p className="mt-3 max-w-52 text-sm leading-6 text-blue-100">Property operations for real estate businesses in Zambia.</p>
        </div>
        {linkGroups.map(({ title, links }) => (
          <div key={title}>
            <h2 className="text-sm font-bold">{title}</h2>
            <ul className="mt-3 space-y-2">
              {links.map(({ label, href }) => (
                <li key={href}><Link href={href} className="text-sm text-blue-100 hover:underline">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="site-width border-t border-white/30 py-4 text-xs text-blue-100">© PropertyFlow ZM</p>
    </footer>
  );
}
