import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isProtectedPath } from "@/lib/auth/redirects";
import { demoProperties } from "@/lib/demo-properties";
import { getPublicEnvironment } from "@/lib/env/public";

export async function proxy(request: NextRequest) {
  const listingPath = /^\/properties\/([^/]+)$/.exec(request.nextUrl.pathname);
  if (listingPath && !demoProperties.some(({ id, status }) => status === "available" && id === listingPath[1])) {
    // Cache Components can stream an unknown segment before notFound() determines its status.
    return NextResponse.rewrite(new URL("/404", request.url), { status: 404 });
  }
  let response = NextResponse.next({ request });
  const environment = getPublicEnvironment();
  const supabase = createServerClient(
    environment.NEXT_PUBLIC_SUPABASE_URL,
    environment.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    {
      cookieOptions: { httpOnly: true, secure: new URL(environment.NEXT_PUBLIC_APP_URL).protocol === "https:" },
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();
  if (!data?.claims && isProtectedPath(request.nextUrl.pathname)) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", `${request.nextUrl.pathname}${request.nextUrl.search}`);
    return NextResponse.redirect(login);
  }
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
