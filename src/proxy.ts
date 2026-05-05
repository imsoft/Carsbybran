import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { decrypt } from "@/lib/session";

const locales = ["en-US", "es-MX"] as const;
const defaultLocale = "en-US";

const AUTH_SEGMENTS = ["/login", "/register"];
const PROTECTED_PREFIXES = ["/dashboard", "/preview"];
const USER_ROUTE_SEGMENTS = ["/profile", "/favorites", "/my-reviews"];

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language") ?? "";
  const primary = acceptLanguage.split(",")[0].trim().split(";")[0].toLowerCase();
  if (primary.startsWith("es")) return "es-MX";
  return defaultLocale;
}

function isLocalizedAuthRoute(pathname: string): boolean {
  return locales.some((locale) =>
    AUTH_SEGMENTS.some(
      (seg) => pathname === `/${locale}${seg}` || pathname.startsWith(`/${locale}${seg}/`)
    )
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get("cbb_session")?.value;
  const session = token ? await decrypt(token) : null;
  const isAuthenticated = !!session;

  const isUserRoute = USER_ROUTE_SEGMENTS.some((seg) =>
    pathname.match(new RegExp(`^/[^/]+${seg}(/|$)`))
  );
  const isProtected =
    PROTECTED_PREFIXES.some((p) => pathname.startsWith(p)) || isUserRoute;

  const authRoute = isLocalizedAuthRoute(pathname);

  // Redirect authenticated users away from login/register
  if (isAuthenticated && authRoute) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Redirect unauthenticated users to localized login
  if (!isAuthenticated && isProtected) {
    const locale = getLocale(request);
    const loginUrl = new URL(`/${locale}/login`, request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Skip locale redirect for auth routes and protected routes
  if (isProtected || authRoute) {
    return NextResponse.next();
  }

  // ── Locale redirect (public routes) ──────────────────────────────────────
  const hasLocale = locales.some(
    (locale) =>
      pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (hasLocale) return NextResponse.next();

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|api/|.*\\..*).*)",
  ],
};
