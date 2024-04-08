import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { LoginClient } from "./login-client";
import { SignupClient } from "./signup-client";
import { getSessionUserAndRedirectHome } from "@/network/server/users";

export default async function Page() {
    // If the user is authenticated, redirect to home
    await getSessionUserAndRedirectHome();

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Tabs defaultValue="login" className="max-lg:w-[80%] lg:w-1/2 my-5">
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
    );
}
