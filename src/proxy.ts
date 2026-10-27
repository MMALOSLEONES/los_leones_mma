import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { TOKEN_COOKIE } from "@/lib/session";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Zone admin : pas de langue, protégée par le token
  if (pathname.startsWith("/dashboard")) {
    const token = request.cookies.get(TOKEN_COOKIE)?.value;
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  // Login : pas de langue, accessible sans token
  if (pathname.startsWith("/login")) {
    return NextResponse.next();
  }

  // Tout le reste = site public → next-intl gère la langue
  return intlMiddleware(request);
}

export const config = {
  // Tout sauf api, _next, _vercel et les fichiers (favicon.ico, images…)
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};