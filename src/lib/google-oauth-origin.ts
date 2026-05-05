import type { NextRequest } from "next/server";

/**
 * Base URL for Google OAuth redirect_uri. Must match Authorized redirect URIs
 * in Google Cloud Console character-for-character.
 *
 * In production, prefers AUTH_URL so the host is always the public domain
 * (avoids mismatches when the request host is internal or a preview URL).
 */
export function getGoogleOAuthOrigin(request: NextRequest): string {
  if (process.env.NODE_ENV === "production") {
    const raw = process.env.AUTH_URL?.trim();
    if (raw) {
      try {
        return new URL(raw).origin;
      } catch {
        // fall through
      }
    }
  }
  return request.nextUrl.origin;
}
