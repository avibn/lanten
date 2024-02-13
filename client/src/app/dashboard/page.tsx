import { Sidebar } from "@/components/sidebar";
import { getCurrentUserServer } from "@/network/user";

export const revalidate = 0;

export default async function Home() {
    let user = null;
    try {
        user = await getCurrentUserServer();
    } catch (error) {
        console.error("Failed to get current user");
    }

    return (
        <div>
            <div className="">
                <div className="bg-background h-screen">
                    <div className="grid lg:grid-cols-6">
                        <Sidebar />
                        <div className="col-span-3 lg:col-span-4 lg:border-l">
                            <h1>Home</h1>
                            <p>Welcome to the home page!</p>
                            <p>User: {user?.name}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
