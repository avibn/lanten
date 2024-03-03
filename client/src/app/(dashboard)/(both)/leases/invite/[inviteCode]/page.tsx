import { InviteClient } from "./invite-client";
import { LeaseTenant } from "@/models/lease-tenant";
import { joinLease } from "@/network/server/tenants";
import { revalidateTag } from "next/cache";

interface PageProps {
    params: {
        inviteCode: string;
    };
}

export default async function Page({ params: { inviteCode } }: PageProps) {
    let leaseTenant: LeaseTenant | null = null;
    let redirectPath: string | null;
    try {
        leaseTenant = await joinLease(inviteCode);
    } catch (error) {
        redirectPath = null;
    }

    const refreshLeases = async () => {
        "use server";
        revalidateTag("leases");
    };

    return (
        <InviteClient leaseTenant={leaseTenant} refreshLeases={refreshLeases} />
    );
}
