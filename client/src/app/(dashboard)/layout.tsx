import { DashboardLayout } from "./dashboard-layout";
import { getSessionUserOrRedirect } from "@/network/server/users";

export default async function Layout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Make sure the user is logged in
    await getSessionUserOrRedirect();

    return <DashboardLayout>{children}</DashboardLayout>;
}
