import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export function AccountPanel({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="mx-auto flex min-h-[65vh] max-w-7xl items-center justify-center px-5 py-12 sm:px-8">
        <section className="w-full max-w-lg rounded-[1.65rem] border border-line bg-white p-6 sm:p-10">
          {children}
        </section>
      </main>
      <SiteFooter />
    </>
  );
}
