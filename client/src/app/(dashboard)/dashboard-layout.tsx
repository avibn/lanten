"use client";

import { Sidebar } from "@/components/sidebar";
import { usePathname } from "next/navigation";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const sideBarItems = [
        { name: "Home", href: "/home" },
        { name: "Properties", href: "/properties" },
        { name: "Leases", href: "/leases" },
        { name: "Tenants", href: "/tenants" },
        { name: "Maintenance", href: "/maintenance" },
    ];
    const pathname = usePathname();
    const currentPageName = sideBarItems.find(
        (item) => item.href === pathname
    )?.name;

    return (
        <div className="bg-background h-screen">
            <div className="grid lg:grid-cols-6">
                <Sidebar sideBarItems={sideBarItems} />
                <div className="col-span-4 lg:col-span-5 lg:border-l py-4 px-12">
                    {currentPageName && (
                        <h2 className="text-3xl font-bold tracking-tight">
                            {currentPageName}
                        </h2>
                    )}
                    <div className="mt-6">{children}</div>
                </div>
            </div>
        </div>
    );
}
