import { NextRequest, NextResponse } from "next/server";
import getSession from "./lib/session";

interface Routes {
  [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
  "/": true,
  "/log-in": true,
  "/create-account": true,
};

export async function middleware(request: NextRequest) {
  const session = await getSession();
  const exists = publicOnlyUrls[request.nextUrl.pathname];
  if (!session.id) {
    if (!exists) return NextResponse.redirect(new URL("/log-in", request.url));
    // 로그인되지 않은 유저가 public이외의 url에 접근하려 할 때.
  } else {
    if (exists) return NextResponse.redirect(new URL("/profile", request.url));
    // 로그인된 유저인데 public인 url에 접근하려 할 때.
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
