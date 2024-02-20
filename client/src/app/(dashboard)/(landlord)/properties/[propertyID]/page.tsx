import { Metadata, ResolvingMetadata } from "next";

import { BackButton } from "@/components/back-button";
import { MainButton } from "@/components/main-button";
import { Property } from "@/models/property";
import { formatTime } from "@/utils/format-time";
import { getProperty } from "@/network/server/properties";
import { getSessionUserOrRedirect } from "@/network/server/users";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        propertyID: string;
    };
}

export async function generateMetadata(
    { params: { propertyID } }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Get the property data for metadata
    let property: Property | null;
    try {
        property = await getProperty(propertyID);
    } catch (error) {
        property = null;
    }

    return {
        title: property ? `${property.name} | Property` : "Property",
        description: property?.description,
    };
}

export default async function Page({ params: { propertyID } }: PageProps) {
    // Ensure the user is a landlord
    await getSessionUserOrRedirect("LANDLORD");

    // Get the property data
    let property = null;
    try {
        property = await getProperty(propertyID);
    } catch (error) {
        redirect("/properties");
        // notFound(); // todo:: 404 error page
    }

    // Get the active and inactive leases
    const activeLeases = property.leases?.filter((lease) => !lease.isDeleted);
    const inactiveLeases = property.leases?.filter((lease) => lease.isDeleted);

    return (
        <div className="flex flex-col items-start gap-5">
            <BackButton text="Properties" href="/properties" />
            <div className="flex items-center justify-between w-full">
                <h1 className="text-xl font-bold">{property.name}</h1>
                <MainButton
                    text="Edit Property"
                    href={`/properties/${property.id}/edit`}
                />
            </div>
            <p>{property.description}</p>
            <p>{property.address}</p>
            <div>
                <h2 className="text-lg font-bold">
                    Active Leases ({activeLeases?.length})
                </h2>
                <ul>
                    {activeLeases?.map((lease) => (
                        <li key={lease.id}>
                            <p>Start Date: {formatTime(lease.startDate)}</p>
                            <p>End Date: {formatTime(lease.endDate)}</p>
                            <p>Total Rent: {lease.totalRent}</p>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <h2 className="text-lg font-bold">
                    Inactive Leases ({inactiveLeases?.length})
                </h2>
                <ul>
                    {inactiveLeases?.map((lease) => (
                        <li key={lease.id}>
                            <p>Start Date: {formatTime(lease.startDate)}</p>
                            <p>End Date: {formatTime(lease.endDate)}</p>
                            <p>Total Rent: {lease.totalRent}</p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
