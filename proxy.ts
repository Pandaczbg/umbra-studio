import { NextResponse, type NextRequest } from "next/server";

/** Server HTML language follows the URL, never an untrusted incoming header. */
export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers);
  const path = request.nextUrl.pathname;
  headers.set(
    "x-umbra-locale",
    path === "/en" || path.startsWith("/en/") ? "en" : "sr",
  );
  return NextResponse.next({ request: { headers } });
}

export const config = { matcher: ["/((?!api|_next|.*\\..*).*)"] };
