import Link from "next/link";
import { AccountPanel } from "@/components/account-panel";

export default function NotFound() {
  return <AccountPanel>
      <h1 className="text-4xl font-semibold tracking-tight">Page unavailable</h1>
      <p className="mt-4 text-muted-ink">Check the address or browse the example property listings.</p>
      <Link href="/properties" className="brand-button-primary mt-6 inline-flex rounded-full px-5 py-3 font-semibold">Browse properties</Link>
  </AccountPanel>;
}
