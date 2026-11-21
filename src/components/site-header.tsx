"use client";

import Link from "next/link";
import { useState } from "react";
import { Building2, Menu, X } from "lucide-react";

const navItems = [
  { label: "Features", href: "/features" },
  { label: "Solutions", href: "/#solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Enterprise", href: "/enterprise" },
  { label: "About", href: "/about" },
  { label: "Request a demo", href: "/contact" },
];

export function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#E5EAF0] bg-white/95 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-3.5 sm:px-6">
        <Link href="/" className="flex shrink-0 items-center gap-3 text-[#17212F]" onClick={() => setMenuOpen(false)}>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#142A43] text-white">
            <Building2 className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight sm:text-lg">PropertyFlow ZM</span>
        </Link>

        <nav aria-label="Main navigation" className="hidden items-center gap-5 text-sm font-medium text-[#667085] xl:flex">
          {navItems.map((item) => (
            <Link key={item.label} href={item.href} className="whitespace-nowrap transition hover:text-[#142A43]">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <Link href="/login" className="hidden rounded-full px-3 py-2 text-sm font-medium text-[#17212F] transition hover:bg-[#F7F9FC] sm:inline-flex">
            Sign in
          </Link>
          <Link href="/register" className="brand-button-primary hidden rounded-full px-3.5 py-2 text-sm font-medium text-white min-[360px]:inline-flex sm:px-4">
            Get started
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#E5EAF0] bg-white text-[#17212F] xl:hidden"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <X className="h-4 w-4" aria-hidden="true" /> : <Menu className="h-4 w-4" aria-hidden="true" />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" aria-label="Mobile navigation" className="border-t border-[#E5EAF0] bg-white px-5 py-3 xl:hidden">
          <div className="mx-auto grid max-w-7xl gap-1">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#17212F] hover:bg-[#F7F9FC]"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/register"
              className="brand-button-primary mt-2 inline-flex min-h-10 items-center justify-center rounded-full px-4 py-2 text-sm font-semibold text-white min-[360px]:hidden"
              onClick={() => setMenuOpen(false)}
            >
              Get started
            </Link>
            <Link
              href="/login"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[#17212F] hover:bg-[#F7F9FC] sm:hidden"
              onClick={() => setMenuOpen(false)}
            >
              Sign in
            </Link>
          </div>
        </nav>
      )}
    </header>
  );
}
