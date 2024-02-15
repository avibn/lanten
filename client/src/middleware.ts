import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const protectedRoutes = [
    "/home",
    "/properties",
    "/leases",
    "/tenants",
    "/maintenance",
];

export function middleware(request: NextRequest) {
    const currentUser = request.cookies.get("connect.sid")?.value;

    // Check protected routes
    const isProtectedRoute = protectedRoutes.some((route) =>
        request.nextUrl.pathname.startsWith(route)
    );
    if (isProtectedRoute && !currentUser) {
        return NextResponse.redirect(new URL("/login", request.url));
    }
}

export const config = {
    matcher: [
        "/login",
        "/signup",
        ...protectedRoutes.map((route) => `${route}/:path*`),
    ],
};
