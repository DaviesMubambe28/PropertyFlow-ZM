export function safeReturnPath(value: string | null, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//") || value.includes("\\")) {
    return fallback;
  }
  const origin = "https://propertyflow.invalid";
  if (!URL.canParse(value, origin)) return fallback;
  const path = new URL(value, origin);
  if (path.origin !== origin || path.pathname.startsWith("//")) return fallback;
  return `${path.pathname}${path.search}${path.hash}`;
}

export function isProtectedPath(pathname: string) {
  return pathname === "/dashboard" || pathname.startsWith("/dashboard/") || pathname.startsWith("/staff/");
}
