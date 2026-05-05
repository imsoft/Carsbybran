import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { encrypt } from "@/lib/session";
import { findOrCreateGoogleUser } from "@/app/actions/auth";
import { getGoogleOAuthOrigin } from "@/lib/google-oauth-origin";

const COOKIE_NAME = "cbb_session";
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

type GoogleTokenResponse = {
  access_token: string;
  id_token: string;
  error?: string;
};

type GoogleUserInfo = {
  sub: string;
  email: string;
  name: string;
  picture?: string;
  email_verified?: boolean;
};

function errorRedirect(origin: string, message: string): NextResponse {
  const url = new URL("/login", origin);
  url.searchParams.set("error", message);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const origin = getGoogleOAuthOrigin(request);
  const { searchParams } = request.nextUrl;
  const code = searchParams.get("code");
  const stateParam = searchParams.get("state");
  const oauthError = searchParams.get("error");

  if (oauthError) {
    return errorRedirect(origin, "google_denied");
  }

  if (!code || !stateParam) {
    return errorRedirect(origin, "invalid_request");
  }

  // ── Verify CSRF state ──
  let stateData: { csrf: string; from: string };
  try {
    stateData = JSON.parse(Buffer.from(stateParam, "base64url").toString());
  } catch {
    return errorRedirect(origin, "invalid_state");
  }

  const storedCsrf = request.cookies.get("oauth_state")?.value;
  if (!storedCsrf || storedCsrf !== stateData.csrf) {
    return errorRedirect(origin, "csrf_mismatch");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    return errorRedirect(origin, "not_configured");
  }

  // ── Exchange code for tokens ──
  let tokens: GoogleTokenResponse;
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: `${origin}/api/auth/google/callback`,
        grant_type: "authorization_code",
      }),
    });
    tokens = await tokenRes.json();
  } catch {
    return errorRedirect(origin, "token_exchange_failed");
  }

  if (tokens.error || !tokens.access_token) {
    return errorRedirect(origin, "token_error");
  }

  // ── Fetch Google user info ──
  let googleUser: GoogleUserInfo;
  try {
    const infoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });
    googleUser = await infoRes.json();
  } catch {
    return errorRedirect(origin, "userinfo_failed");
  }

  if (!googleUser.email) {
    return errorRedirect(origin, "no_email");
  }

  // ── Find or create user ──
  const user = await findOrCreateGoogleUser({
    id: googleUser.sub,
    email: googleUser.email,
    name: googleUser.name || googleUser.email.split("@")[0],
  });

  // ── Create session ──
  const expiresAt = new Date(Date.now() + SESSION_DURATION);
  const jwt = await encrypt({
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role as import("@/lib/definitions").UserRole,
    expiresAt,
  });

  const redirectTo = stateData.from && stateData.from.startsWith("/")
    ? stateData.from
    : user.role === "admin" ? "/dashboard" : "/";

  const response = NextResponse.redirect(new URL(redirectTo, origin));

  response.cookies.set(COOKIE_NAME, jwt, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });

  // Clear the CSRF cookie
  response.cookies.delete("oauth_state");

  return response;
}
