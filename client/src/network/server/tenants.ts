import { Invite } from "@/models/invite";
import { LeaseTenant } from "@/models/lease-tenant";
import { fetchDataServer } from "../helpers/fetch-data-server";

export async function getAllTenants(): Promise<LeaseTenant[]> {
    const response = await fetchDataServer("/leases/tenants", {
        next: {
            revalidate: 20,
        },
    });
    return await response.json();
}

export async function getAllLeaseTenants(
    leaseId: string
): Promise<LeaseTenant[]> {
    const response = await fetchDataServer(`/leases/${leaseId}/tenants`, {
        next: {
            revalidate: 0,
            tags: ["LeaseTenants"],
        },
    });
    return await response.json();
}

export async function getLeaseInvites(leaseId: string): Promise<Invite[]> {
    const response = await fetchDataServer(
        `/leases/${leaseId}/tenants/invites`,
        {
            next: {
                revalidate: 0,
            },
        }
    );
    return await response.json();
}

export async function joinLease(inviteCode: string): Promise<LeaseTenant> {
    const response = await fetchDataServer(`/leases/join`, {
        method: "POST",
        body: JSON.stringify({ inviteCode }),
        credentials: "include",
    });

    return await response.json();
}
