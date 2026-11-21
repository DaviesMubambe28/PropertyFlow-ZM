import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { AppProvider } from "@/components/app-provider";
import { getSiteOrigin } from "@/lib/site-url";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const origin = getSiteOrigin();

export const metadata: Metadata = {
  metadataBase: origin ? new URL(origin) : undefined,
  title: { default: "PropertyFlow ZM", template: "%s | PropertyFlow ZM" },
  description: "Property inventory, client enquiries, viewings, and sales pipeline in one workspace for Zambian real estate agencies.",
  openGraph: { siteName: "PropertyFlow ZM", type: "website", locale: "en_ZM" },
  robots: origin ? undefined : { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full bg-canvas text-ink">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
