import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllLeaseTenants, getLeaseInvites } from "@/network/server/tenants";

import CardError from "@/components/card-error";
import { Invite } from "@/models/invite";
import { InviteDialog } from "./invite-dialog";
import { Lease } from "@/models/lease";
import { LeaseTenant } from "@/models/lease-tenant";
import TenantList from "./tenant-list";

interface CardTenantsProps {
    lease: Lease;
}

export default async function TenantsCard({ lease }: CardTenantsProps) {
    let tenants: LeaseTenant[] = [];
    try {
        tenants = await getAllLeaseTenants(lease.id);
    } catch (error) {
        console.error("Error fetching lease tenants", error);
        return <CardError message="Tenants could not be loaded." />;
    }

    const getCurrentInvites = async (): Promise<Invite[]> => {
        "use server";
        try {
            const invites = await getLeaseInvites(lease.id);
            return invites;
        } catch (error) {
            console.error("Error fetching lease invites", error);
            return [];
        }
    };

    return (
        <Card className="flex-1">
            <CardHeader>
                <div className="flex items-center justify-between w-full">
                    <CardTitle className="text-lg font-medium">
                        Tenants ({tenants.length})
                    </CardTitle>
                    <InviteDialog
                        lease={lease}
                        getCurrentInvites={getCurrentInvites}
                    />
                </div>
                <TenantList leaseId={lease.id} leaseTenants={tenants} />
            </CardHeader>
        </Card>
    );
}
