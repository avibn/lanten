"use client";

import { LeaseTenant } from "@/models/lease-tenant";
import LoadingSpinner from "@/components/loading-spinner";
import { toast } from "sonner";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface InviteClientProps {
    leaseTenant: LeaseTenant | null;
    refreshLeases: () => void;
}
export function InviteClient({
    leaseTenant,
    refreshLeases,
}: InviteClientProps) {
    const router = useRouter();

    useEffect(() => {
        if (leaseTenant) {
            refreshLeases();
            router.push(`/leases/${leaseTenant.leaseId}`);
            router.refresh();
            toast.success("You have joined the lease!");
        } else {
            router.push("/leases");
            toast.error("Failed to join lease. Please try again.");
        }
    }, [leaseTenant, refreshLeases, router]);

    return <LoadingSpinner />;
}
