import { BackButton } from "@/components/buttons/back-button";
import { EditLeaseClient } from "./edit-lease-client";
import { getLease } from "@/network/server/leases";
import { getSessionUserOrRedirect } from "@/network/server/users";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        leaseID: string;
    };
}

export const metadata = {
    title: "Edit Lease",
    description: "Edit the lease details",
};

export default async function Page({ params: { leaseID } }: PageProps) {
    // Ensure the user is a landlord
    await getSessionUserOrRedirect("LANDLORD");

    // Get the lease data
    let lease = null;
    try {
        lease = await getLease(leaseID);
    } catch (error) {
        redirect("/leases");
    }

    return (
        <div className="flex flex-col items-start">
            <BackButton text="Lease View" href={`/leases/${lease.id}`} />
            <EditLeaseClient lease={lease} className="w-full" />
        </div>
    );
}
