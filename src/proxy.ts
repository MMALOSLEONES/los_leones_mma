import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { TOKEN_COOKIE } from "@/lib/session";

// Next.js 16 : "middleware" s'appelle maintenant "proxy",
// et la fonction exportée doit s'appeler "proxy".
export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Ne s'applique qu'à ces routes
export const config = {
  matcher: ["/dashboard/:path*"],
};
