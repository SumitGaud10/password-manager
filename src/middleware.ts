import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.AUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  const session = !!token;
  const { pathname } = req.nextUrl;

  console.log("MIDDLEWARE HIT:", pathname, "session:", !!session);

  // Protect homepage `/`
  if (pathname === "/") {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If logged in, block `/login` and `/register`
  if (
    session &&
    (pathname.startsWith("/login") || pathname.startsWith("/register"))
  ) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

// Match all routes except static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
