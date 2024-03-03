import { Metadata, ResolvingMetadata } from "next";

import { BackButton } from "@/components/buttons/back-button";
import { DeleteLeaseClient } from "./delete-lease-client";
import { EditButton } from "@/components/buttons/edit-button";
import { LandlordPage } from "./landlord-page";
import { Lease } from "@/models/lease";
import { formatTimeToDateString } from "@/utils/format-time";
import { getLease } from "@/network/server/leases";
import { getSessionUser } from "@/network/server/users";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        leaseID: string;
    };
}

export async function generateMetadata(
    { params: { leaseID } }: PageProps,
    parent: ResolvingMetadata
): Promise<Metadata> {
    // Get the property data for metadata
    let lease: Lease | null;
    try {
        lease = await getLease(leaseID);
    } catch (error) {
        lease = null;
    }

    return {
        title: lease
            ? `${formatTimeToDateString(lease.startDate)} | Lease`
            : "Lease",
    };
}

export default async function Page({ params: { leaseID } }: PageProps) {
    // Get user session
    const user = await getSessionUser();

    // Get the lease data
    let lease: Lease | null = null;
    try {
        lease = await getLease(leaseID);
    } catch (error) {
        redirect("/leases");
        // notFound(); // todo:: 404 error page
    }
    console.log(lease);

    return (
        <div className="flex flex-col items-start gap-5">
            <BackButton text="Leases" href="/leases" />
            <div className="flex items-center justify-between w-full">
                <div className="flex gap-4 items-center">
                    <h1 className="text-xl font-bold">
                        Lease - {lease.property?.name}
                    </h1>
                    {/* <p className="text-gray-500">
                        {leaseDurationMonths} months
                    </p> */}
                </div>
                <div className="flex items-center gap-2">
                    {user?.userType === "LANDLORD" ? (
                        <>
                            <EditButton
                                text="Edit Lease"
                                href={`/leases/${lease.id}/edit`}
                            />
                            <DeleteLeaseClient leaseID={leaseID} />
                        </>
                    ) : (
                        <></> // todo:: leave lease
                    )}
                </div>
            </div>
            <div className="flex flex-col w-full gap-4">
                {user?.userType === "LANDLORD" ? (
                    <LandlordPage user={user} lease={lease} />
                ) : (
                    <></> // todo
                )}
            </div>
        </div>
    );
}
