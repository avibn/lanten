import { LoginClient } from "./login-client";
import { getSessionUserAndRedirectHome } from "@/network/server/users";

export default async function Page() {
    // If the user is authenticated, redirect to home
    await getSessionUserAndRedirectHome();

    return <LoginClient />;
}
