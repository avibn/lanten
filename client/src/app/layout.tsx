import "@/styles/globals.css";

import { AuthProvider } from "@/providers/auth-provider";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import { ReactQueryProvider } from "@/providers/react-query-provider";
import { Toaster } from "@/components/ui/sonner";
import { getCurrentUserServer } from "@/network/user";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "App",
    description: "Tenant management application",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    // Get current user
    let user = null;
    try {
        user = await getCurrentUserServer();
    } catch (error) {
        console.error("Failed to get current user");
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
