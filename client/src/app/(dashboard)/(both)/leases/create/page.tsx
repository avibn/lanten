import { BackButton } from "@/components/buttons/back-button";
import { CreateLeaseClient } from "./create-lease-client";
import { Property } from "@/models/property";
import { getProperties } from "@/network/server/properties";
import { getSessionUserOrRedirect } from "@/network/server/users";

export const metadata = {
    title: "Create Lease",
    description: "Create a new lease",
};

interface PageProps {
    searchParams: { [key: string]: string | string[] | undefined };
}

export default async function Page({ searchParams }: PageProps) {
    // Ensure the user is a landlord
    await getSessionUserOrRedirect("LANDLORD");

    // Get the user's properties
    let properties: Property[] = [];
    try {
        properties = await getProperties();
    } catch (err) {
        console.error("Error fetching properties", err);
    }

    // Pass query params
    const selectedProperty = searchParams.property as string | undefined;

    return (
        <div className="flex flex-col items-start">
            <BackButton text="Leases" href="/leases" />
            <CreateLeaseClient
                properties={properties}
                className="w-full"
                selectedProperty={selectedProperty}
            />
        </div>
    );
}
