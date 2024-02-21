import { BackButton } from "@/components/buttons/back-button";
import { CreatePropertyClient } from "./create-property-client";
import { getSessionUserOrRedirect } from "@/network/server/users";

export const metadata = {
    title: "Create Property",
    description: "Create a new property",
};

export default async function Page() {
    // Ensure the user is a landlord
    await getSessionUserOrRedirect("LANDLORD");

    return (
        <div className="flex flex-col items-start">
            <BackButton text="Properties" href="/properties" />
            <CreatePropertyClient className="w-full" />
        </div>
    );
}
