"use client";

import { Button } from "./ui/button";
import { Card } from "./ui/card";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/utils/tw-merge";
import { toast } from "sonner";
import { useAuthStore } from "@/stores/use-auth-store";
import { useLogoutMutation } from "@/network/user";
import { useRouter } from "next/navigation";

export function Sidebar() {
    const router = useRouter();
    const loggedInUser = useAuthStore((state) => state.user);
    const logoutMutation = useLogoutMutation();

    const handleLogout = () => {
        logoutMutation.mutate();
        router.push("/login");
        toast.success("Logged out successfully!");
    };

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
                            <Button
                                variant="secondary"
                                className="w-full justify-start"
                                asChild
                            >
                                <Link href="/dashboard">Dashboard</Link>
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                Properties
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                Leases
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                Tenants
                            </Button>
                            <Button
                                variant="ghost"
                                className="w-full justify-start"
                            >
                                Maintenance
                            </Button>
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
                                    src={loggedInUser?.avatar}
                                    alt="user"
                                    className="w-8 h-8 rounded-full"
                                    width={32}
                                    height={32}
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
