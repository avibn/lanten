"use client";

import { LogOut, Menu, Settings, icons } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { IconButton } from "./buttons/icon-button";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useLogoutMutation } from "@/network/client/users";

export type SidebarIcon = keyof typeof icons;
export type SidebarItem = {
    name: string;
    href: string;
    roles: string[];
    icon: SidebarIcon;
};
interface SidebarProps {
    sideBarItems: SidebarItem[];
}

export function Sidebar({ sideBarItems }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const loggedInUser = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const logoutMutation = useLogoutMutation();
    const [open, setOpen] = useState(true);

    // Icon
    const createIcon = (icon: SidebarIcon) => {
        console.log(icon);
        const LucideIcon = icons[icon];
        return <LucideIcon size={20} strokeWidth={1} className="mr-3" />;
    };

    // Listen to the resize event
    useEffect(() => {
        if (window.innerWidth > 1024) {
            setOpen(true);
        } else {
            setOpen(false);
        }

        window.addEventListener("resize", () => {
            if (window.innerWidth > 1024) {
                setOpen(true);
            } else {
                setOpen(false);
            }
        });
    }, []);

    // Logout handler
    const handleLogout = () => {
        logoutMutation.mutate();
    };

    // Handle logout mutation
    if (logoutMutation.isError) {
        toast.error("Failed to logout");
    }

    if (logoutMutation.isSuccess) {
        setUser(null);
        toast.success("Logged out successfully");
        router.push("/login");
    }

    const closeSidebar = () => {
        if (window.innerWidth < 1024) {
            setOpen(false);
        }
    };

    return (
        // todo cn className
        <div className="lg:h-screen max-lg:col-span-6">
            <div className="space-y-4 py-4 h-full">
                <div className="px-3 lg:py-2 flex flex-col justify-between h-full">
                    <div>
                        <div className="flex items-center justify-between lg:mb-5 max-lg:mb-2 px-4">
                            <Link href="/home" onClick={closeSidebar}>
                                <div className="flex items-center space-x-2">
                                    <Image
                                        alt="Logo"
                                        height={25}
                                        src="/logo.png"
                                        width={25}
                                    />
                                    <h2 className="text-lg font-semibold tracking-tight">
                                        Lanten
                                    </h2>
                                </div>
                            </Link>
                            <div className="lg:hidden">
                                <IconButton
                                    icon={<Menu size={18} />}
                                    onClick={() => setOpen(!open)}
                                />
                            </div>
                        </div>
                        {open && (
                            <div className="space-y-1">
                                {sideBarItems.map(
                                    (item) =>
                                        // Check user roles
                                        loggedInUser &&
                                        item.roles.includes(
                                            loggedInUser?.userType
                                        ) && (
                                            <Button
                                                key={item.name}
                                                variant={
                                                    pathname.startsWith(
                                                        item.href
                                                    )
                                                        ? "secondary"
                                                        : "ghost"
                                                }
                                                className="w-full justify-start"
                                                asChild
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={closeSidebar}
                                                >
                                                    {createIcon(item.icon)}
                                                    {item.name}
                                                </Link>
                                            </Button>
                                        )
                                )}
                            </div>
                        )}
                    </div>
                    {open && (
                        <div className="flex flex-col gap-2 max-lg:mt-5">
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                            >
                                <Settings
                                    size={20}
                                    strokeWidth={1}
                                    className="mr-3"
                                />
                                Settings
                            </Button>
                            <Button
                                variant="outline"
                                className="w-full justify-start"
                                onClick={handleLogout}
                                disabled={logoutMutation.isPending}
                            >
                                <LogOut
                                    size={20}
                                    strokeWidth={1}
                                    className="mr-3"
                                />
                                Logout
                            </Button>

                            <Card className="mt-4">
                                <div className="flex items-center justify-start p-4">
                                    <Image
                                        src="/user-placeholder.png"
                                        alt="user"
                                        className="w-8 h-8 rounded-full"
                                        width={128}
                                        height={128}
                                    />
                                    <div className="ml-2">
                                        <h3 className="text-sm font-semibold">
                                            {loggedInUser?.name}
                                        </h3>
                                        <p className="text-xs text-gray-500">
                                            {loggedInUser?.email}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
