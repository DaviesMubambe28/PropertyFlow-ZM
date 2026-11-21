import { NextResponse } from "next/server";
import { getAdministratorBootstrapInput, getSafeCallbackPath } from "@/lib/auth/registration-callback";
import { getPublicEnvironment } from "@/lib/env/public";
import { createClient } from "@/lib/supabase/server";

function errorRedirect(appUrl: string, reason: string) {
  const destination = new URL("/login", appUrl);
  destination.searchParams.set("error", reason);
  return NextResponse.redirect(destination);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const appUrl = getPublicEnvironment().NEXT_PUBLIC_APP_URL;
  const code = requestUrl.searchParams.get("code");
  if (!code) return errorRedirect(appUrl, "invalid_callback");
  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) return errorRedirect(appUrl, "verification_failed");
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user) return errorRedirect(appUrl, "verification_failed");
  const nextPath = getSafeCallbackPath(requestUrl.searchParams.get("next"));
  if (nextPath === "/reset-password" || nextPath.startsWith("/invitations/")) {
    return NextResponse.redirect(new URL(nextPath, appUrl));
  }
  const bootstrapInput = getAdministratorBootstrapInput(data.user.user_metadata);
  if (!bootstrapInput) return errorRedirect(appUrl, "registration_incomplete");
  const { error: bootstrapError } = await supabase.rpc("bootstrap_organization", bootstrapInput);
  if (bootstrapError) return errorRedirect(appUrl, "workspace_setup_failed");
  return NextResponse.redirect(new URL(nextPath, appUrl));
}
