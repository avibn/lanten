import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get("connect.sid")?.value;

    // If the user is already logged in, redirect to the home page
    // if (
    //     currentUser &&
    //     (request.nextUrl.pathname === "/login" ||
    //         request.nextUrl.pathname === "/signup")
    // ) {
    //     return NextResponse.redirect(new URL("/dashboard", request.url));
    // }

    // If the user is not logged in on dashboard, redirect to the login page
    if (
        !currentUser &&
        request.nextUrl.pathname.startsWith("/dashboard")
    ) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: ["/login", "/signup", "/dashboard/:path*"],
};
