import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import Image from "next/image";
import Link from "next/link";
import { LoginClient } from "./login-client";
import { SignupClient } from "./signup-client";
import { getSessionUserAndRedirectHome } from "@/network/server/users";

interface PageProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
    // If the user is authenticated, redirect to home
    await getSessionUserAndRedirectHome();

    const tab = searchParams?.tab as string | undefined;

    return (
        <>
            <div className="flex items-center justify-between w-full px-6 py-4">
                <Link href="/">
                    <div className="flex items-center space-x-4">
                        <Image
                            alt="Logo"
                            height={40}
                            src="/logo.png"
                            width={40}
                        />
                        <h1 className="text-xl font-bold tracking-tighter">
                            Lanten
                        </h1>
                    </div>
                </Link>
            </div>
            <div className="flex justify-center items-center">
                <Tabs
                    defaultValue={tab || "login"}
                    className="max-lg:w-[80%] lg:w-1/2 my-5"
                >
                    <TabsList className="w-full mb-3">
                        <TabsTrigger value="login" className="w-full">
                            Login
                        </TabsTrigger>
                        <TabsTrigger value="signup" className="w-full">
                            Signup
                        </TabsTrigger>
                    </TabsList>
                    <TabsContent value="login">
                        <LoginClient />
                    </TabsContent>
                    <TabsContent value="signup">
                        <SignupClient />
                    </TabsContent>
                </Tabs>
            </div>
        </>
    );
}
