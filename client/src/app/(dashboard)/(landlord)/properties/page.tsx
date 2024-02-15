import { getSessionUserOrRedirect } from "@/network/server/users";

export const revalidate = 0;

export default async function Home() {
    const user = await getSessionUserOrRedirect();

    return (
        <div>
            <h3 className="text-xl font-semibold tracking-tight">
                Properties of {user?.name}
            </h3>
        </div>
    );
}
