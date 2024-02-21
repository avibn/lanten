import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Metadata, ResolvingMetadata } from "next";

import { AddButton } from "@/components/buttons/add-button";
import { BackButton } from "@/components/buttons/back-button";
import { DeletePropertyCLient } from "./delete-property-client";
import { EditButton } from "@/components/buttons/edit-button";
import { Lease } from "@/models/lease";
import { MainButton } from "@/components/buttons/main-button";
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

    // Function to create lease card items for list
    const createLeaseCards = (leases: Lease[]) => {
        return (
            <>
                {leases?.map((lease) => (
                    <Card key={lease.id} className="mt-3">
                        <CardHeader>
                            <p>
                                Duration: {formatTime(lease.startDate)} -{" "}
                                {formatTime(lease.endDate)}
                            </p>
                            <p>Total Rent: £{lease.totalRent}</p>
                        </CardHeader>
                        <CardFooter>
                            <MainButton
                                text="View Lease"
                                variant={"secondary"}
                                href={`/leases/${lease.id}`}
                                className="w-full"
                            />
                        </CardFooter>
                    </Card>
                ))}
            </>
        );
    };

    return (
        <div className="flex flex-col items-start gap-5">
            <BackButton text="Properties" href="/properties" />
            <div className="flex items-center justify-between w-full">
                <h1 className="text-xl font-bold">{property.name}</h1>
                <div className="flex items-center gap-2">
                    <EditButton
                        text="Edit Property"
                        href={`/properties/${property.id}/edit`}
                    />
                    <DeletePropertyCLient propertyID={propertyID} />
                </div>
            </div>

            <h2 className="text-lg font-bold">Description</h2>
            <p>{property.description}</p>
            <h2 className="text-lg font-bold">Address</h2>
            <p>{property.address}</p>

            <p className="text-sm font-light">
                Created: {formatTime(property.createdAt)}
            </p>
            <p className="text-sm font-light">
                Last Updated: {formatTime(property.updatedAt)}
            </p>

            {/* List of leases */}
            <div className="w-full">
                <div className="flex items-center justify-between w-full">
                    <h2 className="text-lg font-bold">
                        Active Leases ({activeLeases?.length})
                    </h2>
                    <AddButton
                        text="Create Lease"
                        href={`/leases/create?property=${property.id}`}
                    />
                </div>
                <ul className="mt-2">
                    {activeLeases?.length === 0 && (
                        <p className="text-sm">
                            No active leases for this property.
                        </p>
                    )}
                    {activeLeases && createLeaseCards(activeLeases)}
                </ul>
            </div>
            {inactiveLeases?.length !== 0 && (
                <div className="w-full">
                    <h2 className="text-lg font-bold">
                        Inactive Leases ({inactiveLeases?.length})
                    </h2>
                    <ul className="mt-2">
                        {inactiveLeases && createLeaseCards(inactiveLeases)}
                    </ul>
                </div>
            )}
        </div>
    );
}
