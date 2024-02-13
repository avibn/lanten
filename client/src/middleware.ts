import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get("connect.sid")?.value;

    // If the user is already logged in, redirect to the home page
    if (
        currentUser &&
        (request.nextUrl.pathname === "/login" ||
            request.nextUrl.pathname === "/signup")
    ) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }
}

export const config = {
    matcher: ["/login", "/signup", "/dashboard/:path*"],
};
