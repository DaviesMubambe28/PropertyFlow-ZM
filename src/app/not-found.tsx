import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export default function NotFoundPage() {
  return (
    <>
      <SiteHeader />
      <main className="page-intro">
        <div className="site-width py-18 sm:py-24">
          <h1 className="text-4xl font-black tracking-tight sm:text-5xl">Page not found</h1>
          <p className="mt-4 text-quiet">Check the address or return to the PropertyFlow ZM homepage.</p>
          <Link href="/" className="brand-button-secondary mt-7 inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold">
            Back to home
          </Link>
        </div>
      </main>
      <SiteFooter />
    </>
  );
}
