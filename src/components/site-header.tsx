"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Building2, Menu, X } from "lucide-react";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Features", href: "/features" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="site-header">
      <div className="site-width flex min-h-18 items-center justify-between gap-2 sm:gap-5">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-bold tracking-tight" onClick={() => setMenuOpen(false)}>
          <Building2 size={20} aria-hidden="true" />
          <span className="text-sm sm:text-lg">PropertyFlow ZM</span>
        </Link>
        <nav aria-label="Main navigation" className="hidden items-center gap-6 lg:flex">
          {navItems.map(({ href, label }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className="site-nav-link">
              {label}
            </Link>
          ))}
        </nav>
        <div className="flex shrink-0 items-center gap-2.5">
          <Link href="/login" className="site-sign-in">Sign in</Link>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded border border-white/60 lg:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X size={19} aria-hidden="true" /> : <Menu size={19} aria-hidden="true" />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="site-width grid gap-1 border-t border-white/30 pb-4 pt-3 lg:hidden">
          {[...navItems, { href: "/contact", label: "Request a demo" }].map(({ href, label }) => (
            <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className="site-nav-link px-2" onClick={() => setMenuOpen(false)}>
              {label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
