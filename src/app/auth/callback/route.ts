import { NextResponse } from "next/server";
import { getAdministratorBootstrapInput, getSafeCallbackPath } from "@/lib/auth/registration-callback";
import { createClient } from "@/lib/supabase/server";

function errorRedirect(requestUrl: URL, reason: string) {
  const destination = new URL("/login", requestUrl.origin);
  destination.searchParams.set("error", reason);
  return NextResponse.redirect(destination);
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");
  if (!code) return errorRedirect(requestUrl, "invalid_callback");
  const supabase = await createClient();
  const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
  if (exchangeError) return errorRedirect(requestUrl, "verification_failed");
  const { data, error: userError } = await supabase.auth.getUser();
  if (userError || !data.user) return errorRedirect(requestUrl, "verification_failed");
  const nextPath = getSafeCallbackPath(requestUrl.searchParams.get("next"));
  if (nextPath === "/reset-password" || nextPath.startsWith("/invitations/")) {
    return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
  }
  const bootstrapInput = getAdministratorBootstrapInput(data.user.user_metadata);
  if (!bootstrapInput) return errorRedirect(requestUrl, "registration_incomplete");
  const { error: bootstrapError } = await supabase.rpc("bootstrap_organization", bootstrapInput);
  if (bootstrapError) return errorRedirect(requestUrl, "workspace_setup_failed");
  return NextResponse.redirect(new URL(nextPath, requestUrl.origin));
}
