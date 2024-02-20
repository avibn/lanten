import { ClientToast } from "@/components/client-toast";
import { getSessionUser } from "@/network/server/users";

export const metadata = {
    title: "Home",
    description: "Home",
};

interface HomeProps {
    searchParams?: { [key: string]: string | string[] | undefined };
}

export default async function Home({ searchParams }: HomeProps) {
    const user = await getSessionUser();

    // Error message from the URL
    let error = searchParams?.error as string | undefined;

    return (
        <div>
            {error && <ClientToast message={error} type="error" />}
            <h3 className="text-xl font-semibold tracking-tight">
                Welcome, {user?.name}!
            </h3>
            <p className="mt-2 text-gray-500">
                The date is {new Date().toLocaleDateString()}.
            </p>
        </div>
    );
}
