import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./server/session";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  // const path = request.nextUrl.pathname;
  // const user = await getSession();

  // if (!user) {
  //   return NextResponse.redirect(new URL("/signin", request.url));
  // }

  // if (path === "/signin" && user) {
  //   return NextResponse.redirect(new URL("/", request.url));
  // }

  return NextResponse.next();
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/", "/user/:path*", "/group/:path*", "/dm/:path*"],
};
