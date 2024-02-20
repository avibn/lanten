"use client";

import { usePathname, useRouter } from "next/navigation";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/tw-merge";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useLogoutMutation } from "@/network/client/users";

interface SidebarProps {
    sideBarItems: { name: string; href: string; roles: string[] }[];
}

export function Sidebar({ sideBarItems }: SidebarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const loggedInUser = useAuthStore((state) => state.user);
    const setUser = useAuthStore((state) => state.setUser);
    const logoutMutation = useLogoutMutation();

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

    return (
        // todo cn className
        <div className={cn("", "h-screen")}>
            <div className="space-y-4 py-4 h-full">
                <div className="px-3 py-2 flex flex-col justify-between h-full">
                    <div>
                        <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                            Lanten
                        </h2>
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
                                                pathname.startsWith(item.href)
                                                    ? "secondary"
                                                    : "ghost"
                                            }
                                            className="w-full justify-start"
                                            asChild
                                        >
                                            <Link href={item.href}>
                                                {item.name}
                                            </Link>
                                        </Button>
                                    )
                            )}
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                        >
                            Settings
                        </Button>
                        <Button
                            variant="outline"
                            className="w-full justify-start"
                            onClick={handleLogout}
                            disabled={logoutMutation.isPending}
                        >
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
                </div>
            </div>
        </div>
    );
}
