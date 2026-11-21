import type { Metadata } from "next";

export const metadata: Metadata = { title: "Example property listings", robots: { index: false } };

export default function PropertiesLayout({ children }: LayoutProps<"/properties">) {
  return children;
}
