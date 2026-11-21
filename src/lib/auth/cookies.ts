export function authCookieOptions(appUrl: string) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: new URL(appUrl).protocol === "https:",
  };
}
