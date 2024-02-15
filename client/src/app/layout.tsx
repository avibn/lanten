import "@/styles/globals.css";

import { AuthProvider } from "@/providers/auth-provider";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { getSessionUser } from "@/network/server/users";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: {
        template: "%s | Lanten",
        default: "Lanten",
    },
    description: "All-in-one Tenant Management Service",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Get current user
    let user = null;
    try {
        user = await getSessionUser();
    } catch (error) {
        console.error("Failed to get current user (root layout)");
    }

    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider user={user}>
                    <ReactQueryProvider>{children}</ReactQueryProvider>
                </AuthProvider>
                <Toaster richColors theme="light" position="top-center" />
            </body>
        </html>
    );
}
