"use client";

import { Sidebar, SidebarItem } from "@/components/sidebar";

import { ScrollArea } from "@/components/ui/scroll-area";
import { usePathname } from "next/navigation";

const sideBarItems: SidebarItem[] = [
    {
        name: "Home",
        href: "/home",
        roles: ["TENANT", "LANDLORD"],
        icon: "LayoutDashboard",
    },
    {
        name: "Properties",
        href: "/properties",
        roles: ["LANDLORD"],
        icon: "Building",
    },
    {
        name: "Leases",
        href: "/leases",
        roles: ["TENANT", "LANDLORD"],
        icon: "Scroll",
    },
    {
        name: "Tenants",
        href: "/tenants",
        roles: ["LANDLORD"],
        icon: "UsersRound",
    },
    {
        name: "Maintenance",
        href: "/maintenance",
        roles: ["TENANT", "LANDLORD"],
        icon: "Construction",
    },
    {
        name: "Messages",
        href: "/messages",
        roles: ["TENANT", "LANDLORD"],
        icon: "MessageCircle",
    },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const currentPageName = sideBarItems.find(
        (item) => item.href === pathname
    )?.name;

    return (
        <div className="bg-background h-screen">
            <div className="grid lg:grid-cols-6">
                <Sidebar sideBarItems={sideBarItems} />
                <ScrollArea className="col-span-4 lg:col-span-5 lg:border-l px-12 h-screen">
                    <div className="py-4 h-screen">
                        {currentPageName && (
                            <h2 className="text-3xl font-bold tracking-tight">
                                {currentPageName}
                            </h2>
                        )}
                        {children}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
