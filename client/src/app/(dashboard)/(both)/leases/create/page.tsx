import { BackButton } from "@/components/back-button";
import { CreateLeaseClient } from "./create-lease-client";
import { Property } from "@/models/property";
import { getProperties } from "@/network/server/properties";
import { getSessionUserOrRedirect } from "@/network/server/users";

export const metadata = {
    title: "Create Lease",
    description: "Create a new lease",
};

export default async function Page() {
    // Ensure the user is a landlord
    await getSessionUserOrRedirect("LANDLORD");

    // Get the user's properties
    let properties: Property[] = [];
    try {
        properties = await getProperties();
    } catch (err) {
        console.error("Error fetching properties", err);
    }

    return (
        <div className="flex flex-col items-start">
            <BackButton text="Leases" href="/leases" />
            <CreateLeaseClient properties={properties} className="w-full" />
        </div>
    );
}
