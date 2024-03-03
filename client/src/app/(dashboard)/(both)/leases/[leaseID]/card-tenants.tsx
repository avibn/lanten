import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { getAllLeaseTenants, getLeaseInvites } from "@/network/server/tenants";

import { Invite } from "@/models/invite";
import { InviteDialog } from "./invite-dialog";
import { Lease } from "@/models/lease";
import TenantList from "./tenant-list";

interface CardTenantsProps {
    lease: Lease;
}

export default async function CardTenats({ lease }: CardTenantsProps) {
    const tenants = await getAllLeaseTenants(lease.id);
    // todo :: catch error

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
