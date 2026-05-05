import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import crypto from "crypto";

export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) {
    return new NextResponse(
      "Google OAuth no está configurado. Agrega GOOGLE_CLIENT_ID a tus variables de entorno.",
      { status: 503 }
    );
  }

  const { searchParams, origin } = request.nextUrl;
  const from = searchParams.get("from") ?? "/";

  const csrf = crypto.randomBytes(16).toString("hex");
  const state = Buffer.from(JSON.stringify({ csrf, from })).toString("base64url");

  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", `${origin}/api/auth/google/callback`);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("scope", "openid email profile");
  authUrl.searchParams.set("state", state);
  authUrl.searchParams.set("access_type", "offline");
  authUrl.searchParams.set("prompt", "select_account");

  const response = NextResponse.redirect(authUrl);
  response.cookies.set("oauth_state", csrf, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 600,
    path: "/",
  });

  return response;
}
