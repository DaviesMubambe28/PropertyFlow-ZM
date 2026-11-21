export function getSiteOrigin(configured = process.env.NEXT_PUBLIC_APP_URL) {
  if (!configured) return undefined;
  try {
    const url = new URL(configured);
    if (url.protocol !== "https:" || url.username || url.password) return undefined;
    if (url.hostname === "localhost" || url.hostname.endsWith(".localhost") ||
        !url.hostname.includes(".") || /^[\d.]+$/.test(url.hostname)) return undefined;
    return url.origin;
  } catch {
    return undefined;
  }
}

export const indexablePages = ["/", "/about", "/features", "/solutions", "/enterprise", "/pricing", "/contact", "/privacy", "/terms"];
export const privatePages = ["/dashboard", "/staff", "/auth", "/invitations", "/login", "/register", "/forgot-password", "/reset-password"];
