import { Sidebar } from "@/components/sidebar";
import { getCurrentUserServer } from "@/network/user";
import { redirect } from "next/navigation";

export const revalidate = 0;

export default async function Home() {
    let user = null;
    try {
        user = await getCurrentUserServer();
    } catch (error) {
        // Redirect to login
        console.error("Failed to get current user");
        redirect("/login");
    }

    return (
        <div>
            <div className="">
                <div className="bg-background h-screen">
                    <div className="grid lg:grid-cols-6">
                        <Sidebar />
                        <div className="col-span-4 lg:col-span-5 lg:border-l py-4 px-12">
                            <h2 className="text-3xl font-bold tracking-tight">
                                Dashboard
                            </h2>
                            <div className="mt-6">
                                <h3 className="text-xl font-semibold tracking-tight">
                                    Welcome, {user?.name}!
                                </h3>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
