import { getSessionUserOrRedirect } from "@/network/server/users";

export const revalidate = 0;

export const metadata = {
    title: "Home",
    description: "Home",
};

export default async function Home() {
    const user = await getSessionUserOrRedirect();

    return (
        <div>
            <h3 className="text-xl font-semibold tracking-tight">
                Welcome, {user?.name}!
            </h3>
        </div>
    );
}
