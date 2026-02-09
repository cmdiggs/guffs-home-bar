import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_COOKIE = "guffs_admin";

export function middleware(request: NextRequest) {
  if (!request.nextUrl.pathname.startsWith("/admin")) {
    return NextResponse.next();
  }
  if (request.nextUrl.pathname === "/admin/login") {
    return NextResponse.next();
  }
  /* When ADMIN_PASSWORD is not set, allow access to admin without login */
  if (!ADMIN_PASSWORD) {
    return NextResponse.next();
  }
  const token = request.cookies.get(ADMIN_COOKIE)?.value;
  if (token !== ADMIN_PASSWORD) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}
